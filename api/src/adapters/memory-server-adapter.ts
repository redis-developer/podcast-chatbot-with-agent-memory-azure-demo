import type { InvocationContext } from '@azure/functions'
import { config } from '@/config.js'

export enum AMS_Role {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export type AMS_Message = {
  role: AMS_Role
  content: string
  [key: string]: unknown // AMS returns additional fields that need to be passed around but aren't used
}

export type AMS_Memory = {
  id: string
  text: string
  topics: string[]
  created_at: string
  [key: string]: unknown // AMS returns additional fields that need to be passed around but aren't used
}

export type AMS_SearchResponse = {
  memories: AMS_Memory[]
  total: number
  next_offset: string | null
}

export type AMS_WorkingMemory = {
  namespace: string
  user_id: string
  session_id: string
  context: string
  messages: AMS_Message[]
  memories: AMS_Memory[]
  [key: string]: unknown // AMS returns additional fields that need to be passed around but aren't used
}

/**
 * Retrieve conversation history for a session
 */
export async function readWorkingMemory(
  namespace: string,
  userId: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<AMS_WorkingMemory> {
  // Build the request URL
  const url = new URL(`/v1/working-memory/${sessionId}`, config.amsBaseUrl)
  url.searchParams.set('namespace', namespace)
  url.searchParams.set('user_id', userId)

  invocationContext.log(`[AMS GET] ${url.toString()}`)

  // Make the GET request
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '0.12.0'
    }
  })

  // Return empty session for new users
  if (response.status === 404) {
    invocationContext.log(`[AMS GET] Session not found, returning empty session`)
    return {
      namespace,
      user_id: userId,
      session_id: sessionId,
      context: '',
      messages: [],
      memories: []
    } as AMS_WorkingMemory
  }

  // Log and throw on other errors
  if (!response.ok) {
    invocationContext.error(`Failed to get working memory: ${response.statusText}`)
    throw new Error(`Failed to get working memory: ${response.statusText}`)
  }

  // Parse and return the working memory
  const data = (await response.json()) as AMS_WorkingMemory
  invocationContext.log(`[AMS GET] Response:`, JSON.stringify(data, null, 2))

  return data
}

/**
 * Replace conversation history for a session
 */
export async function replaceWorkingMemory(
  sessionId: string,
  context_window_max: number,
  workingMemory: AMS_WorkingMemory,
  invocationContext: InvocationContext
): Promise<AMS_WorkingMemory> {
  // Build the request URL
  const url = new URL(`${config.amsBaseUrl}/v1/working-memory/${sessionId}`)
  url.searchParams.set('context_window_max', context_window_max.toString())

  invocationContext.log(`[AMS PUT] ${url.toString()}`)

  // Make the PUT request
  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '0.12.0'
    },
    body: JSON.stringify(workingMemory)
  })

  // Log and throw on errors
  invocationContext.log(`[AMS PUT] Response Status: ${response.status}`)
  if (!response.ok) {
    invocationContext.error(`Failed to replace working memory: ${response.statusText}`)
    throw new Error(`Failed to replace working memory: ${response.statusText}`)
  }

  // Parse and return the updated working memory
  const data = (await response.json()) as AMS_WorkingMemory
  invocationContext.log(`[AMS PUT] Response:`, JSON.stringify(data, null, 2))

  return data
}

/**
 * Search long-term memories for a user
 * Uses a broad search query with high limit to retrieve all memories via KNN
 */
export async function searchLongTermMemories(
  namespace: string,
  userId: string,
  invocationContext: InvocationContext
): Promise<AMS_Memory[]> {
  // Build the request URL
  const url = new URL(`${config.amsBaseUrl}/v1/long-term-memory/search`)
  url.searchParams.set('namespace', namespace)
  url.searchParams.set('user_id', userId)

  invocationContext.log(`[AMS POST] ${url.toString()}`)

  // Use a broad search query to get all memories via KNN
  const requestBody = {
    text: 'user preferences interests likes dislikes experiences memories',
    limit: 100 // Maximum limit allowed by AMS
  }

  // Make the POST request
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '0.12.0'
    },
    body: JSON.stringify(requestBody)
  })

  // Return empty array for 404 (no memories yet)
  if (response.status === 404) {
    invocationContext.log(`[AMS POST] No memories found, returning empty array`)
    return []
  }

  // Log and throw on other errors
  if (!response.ok) {
    invocationContext.error(`Failed to search long-term memories: ${response.statusText}`)
    throw new Error(`Failed to search long-term memories: ${response.statusText}`)
  }

  // Parse the search response
  const data = (await response.json()) as AMS_SearchResponse
  invocationContext.log(`[AMS POST] Found ${data.total} memories`)

  return data.memories
}
