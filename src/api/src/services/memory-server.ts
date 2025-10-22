import { config } from '@/config.js'

export enum AmsRole {
  USER = 'user',
  ASSISTANT = 'assistant'
}

export type AmsMessage = {
  role: AmsRole
  content: string
}

export type AmsMemory = {
  session_id: string
  namespace: string
  context: string
  messages: AmsMessage[]
}

/**
 * Retrieve conversation history for a session
 */
export async function readWorkingMemory(sessionId: string, namespace: string): Promise<AmsMemory> {
  const url = new URL(`/v1/working-memory/${sessionId}`, config.amsBaseUrl)
  url.searchParams.set('namespace', namespace)

  console.log(`[AMS GET] ${url.toString()}`)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '0.12.0'
    }
  })

  // Return empty session for new users
  if (response.status === 404) {
    console.log(`[AMS GET] Session not found, returning empty session`)
    return { session_id: sessionId, namespace: namespace, context: '', messages: [] }
  }

  if (!response.ok) throw new Error(`Failed to get working memory: ${response.statusText}`)

  const data = (await response.json()) as AmsMemory
  console.log(`[AMS GET] Response:`, JSON.stringify(data, null, 2))

  return data
}

/**
 * Replace conversation history for a session
 */
export async function replaceWorkingMemory(
  sessionId: string,
  context_window_max: number,
  amsMemory: AmsMemory
): Promise<AmsMemory> {
  const url = new URL(`${config.amsBaseUrl}/v1/working-memory/${sessionId}`)
  url.searchParams.set('context_window_max', context_window_max.toString())

  console.log(`[AMS PUT] ${url.toString()}`)

  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '0.12.0'
    },
    body: JSON.stringify(amsMemory)
  })

  console.log(`[AMS PUT] Response Status: ${response.status}`)
  if (!response.ok) throw new Error(`Failed to replace working memory: ${response.statusText}`)

  const data = (await response.json()) as AmsMemory
  console.log(`[AMS PUT] Response:`, JSON.stringify(data, null, 2))

  return data
}

/**
 * Delete conversation history for a session
 */
export async function removeWorkingMemory(sessionId: string, namespace: string): Promise<void> {
  const url = new URL(`/v1/working-memory/${sessionId}`, config.amsBaseUrl)
  url.searchParams.set('namespace', namespace)

  console.log(`[AMS DELETE] ${url.toString()}`)

  const response = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Version': '0.12.0'
    }
  })

  console.log(`[AMS DELETE] Response Status: ${response.status}`)
  if (!response.ok) throw new Error(`Failed to delete working memory: ${response.statusText}`)
}
