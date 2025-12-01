import type { InvocationContext } from '@azure/functions'

import { config } from '@/config.js'
import { generateResponse, LLM_Role } from '@adapters/llm-adapter.js'
import {
  readWorkingMemory,
  replaceWorkingMemory,
  searchLongTermMemories,
  AMS_Role
} from '@adapters/memory-server-adapter.js'
import { appendToChat, createUserSession, listUserSessions, readChat } from '@adapters/redis-storage-adapter.js'
import type { LLM_Message } from '@adapters/llm-adapter.js'
import type { AMS_Message, AMS_WorkingMemory } from '@adapters/memory-server-adapter.js'
import type { SortedSetMember, StreamMessage } from '@adapters/redis-storage-adapter.js'

export type Session = {
  id: string
  lastActive: string // ISO 8601 date string
}

export enum Role {
  USER = 'user',
  PODBOT = 'podbot'
}

export type ChatMessage = {
  role: Role
  content: string
}

export type ContextMessage = {
  role: Role
  content: string
}

export type Memory = {
  id: string
  content: string
  createdAt: string // ISO 8601 date string
  topics: string[]
}

export type Context = {
  summary: string
  recentMessages: ContextMessage[]
  relevantMemories: Memory[]
}

export type ChatWithContext = {
  chatHistory: ChatMessage[]
  context: Context
}

/**
 * List all sessions for a user
 */
export async function fetchSessions(username: string, invocationContext: InvocationContext): Promise<Session[]> {
  try {
    // Get session entries from Redis
    const sessionEntries: SortedSetMember[] = await listUserSessions('podbot', username, invocationContext)

    // Map to Session objects
    return sessionEntries.map(entry => ({
      id: entry.value,
      lastActive: new Date(entry.score).toISOString()
    }))
  } catch (error) {
    invocationContext.error(`Error fetching sessions for podbot.${username}`, error)
    throw error
  }
}

/**
 * Create a new session for a user
 */
export async function createNewSession(username: string, invocationContext: InvocationContext): Promise<Session> {
  try {
    // Create session in Redis
    const sessionEntry: SortedSetMember = await createUserSession('podbot', username, invocationContext)
    invocationContext.log(`Created new session for podbot.${username}: ${sessionEntry.value}`)

    // Return Session object
    return {
      id: sessionEntry.value,
      lastActive: new Date(sessionEntry.score).toISOString()
    }
  } catch (error) {
    invocationContext.error(`Error creating session for podbot.${username}`, error)
    throw error
  }
}

/**
 * Fetch chat history from Redis and context from AMS
 */
export async function fetchSession(
  username: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<ChatWithContext> {
  try {
    // Get chat history from Redis Stream
    const streamMessages: StreamMessage[] = await readChat('podbot', username, sessionId, invocationContext)
    invocationContext.log(`Fetched ${streamMessages.length} messages from Redis for podbot.${username}.${sessionId}`)

    // Get context from AMS
    const context: Context = await fetchContext(username, sessionId, invocationContext)
    invocationContext.log(`Fetched context from AMS for podbot.${username}.${sessionId}`)

    // Map stream messages to chat history
    const chatHistory: ChatMessage[] = streamMessages.map(msg => ({
      role: roleStringToRole(msg.message.role),
      content: msg.message.content ?? ''
    }))

    // Return combined chat history and context
    const chatWithContext: ChatWithContext = { chatHistory, context }
    return chatWithContext
  } catch (error) {
    invocationContext.error(`Error fetching session for podbot.${username}.${sessionId}`, error)
    throw error
  }
}

/**
 * Send a message and get AI response, returning full chat + context
 */
export async function sendMessage(
  username: string,
  sessionId: string,
  message: string,
  invocationContext: InvocationContext
): Promise<ChatWithContext> {
  try {
    // Get existing AMS working memory
    const workingMemory: AMS_WorkingMemory = await readWorkingMemory('podbot', username, sessionId, invocationContext)
    invocationContext.log(`Fetched working memory for podbot.${username}.${sessionId}`)

    // Build LLM messages with context and memories
    const llmMessages: LLM_Message[] = []

    // Add context and memories as JSON in a system message
    if (workingMemory.context || workingMemory.memories.length > 0) {
      llmMessages.push({
        role: LLM_Role.SYSTEM,
        content: JSON.stringify({
          context: workingMemory.context,
          memories: workingMemory.memories
        })
      })
    }

    // Add conversation history as actual messages
    workingMemory.messages.forEach(msg => {
      llmMessages.push({
        role: amsRoleToLlmRole(msg.role),
        content: msg.content
      })
    })

    // Add new user message
    llmMessages.push({ role: LLM_Role.USER, content: message })
    invocationContext.log(`Prepared ${llmMessages.length} messages for LLM`)

    // Get AI response
    const llmResponse: string = await generateResponse(llmMessages, invocationContext)
    invocationContext.log(`Generated AI response for podbot.${username}.${sessionId}`)

    // Save updated working memory to AMS (convert roles with validation)
    const userMessage: AMS_Message = { role: llmRoleToAmsRole(LLM_Role.USER), content: message }
    workingMemory.messages.push(userMessage)

    const assistantMessage: AMS_Message = { role: llmRoleToAmsRole(LLM_Role.ASSISTANT), content: llmResponse }
    workingMemory.messages.push(assistantMessage)

    await replaceWorkingMemory(sessionId, config.amsContextWindowMax, workingMemory, invocationContext)

    invocationContext.log(`Updated working memory for podbot.${username}.${sessionId}`)

    // Save messages to Redis Stream
    await appendToChat('podbot', username, sessionId, 'user', message, invocationContext)
    await appendToChat('podbot', username, sessionId, 'podbot', llmResponse, invocationContext)

    invocationContext.log(`Saved messages to Redis stream for podbot.${username}.${sessionId}`)

    // Return updated chat + context
    // NOTE: Technically we could construct all of this from the above, but re-fetching ensures consistency and is easier
    const streamMessages = await readChat('podbot', username, sessionId, invocationContext)
    const chatHistory = streamMessages.map(msg => ({
      role: roleStringToRole(msg.message.role),
      content: msg.message.content ?? ''
    }))

    const updatedContext = await fetchContext(username, sessionId, invocationContext)

    return { chatHistory, context: updatedContext }
  } catch (error) {
    invocationContext.error(`Error processing message for podbot.${username}.${sessionId}`, error)
    throw error
  }
}

/**
 * Fetch all long-term memories for a user
 */
export async function fetchUserMemories(username: string, invocationContext: InvocationContext): Promise<Memory[]> {
  try {
    invocationContext.log(`Fetching long-term memories for podbot.${username}`)

    // Search AMS long-term memories with broad query to get all memories
    const amsMemories = await searchLongTermMemories('podbot', username, invocationContext)

    // Convert AMS_Memory to Memory format
    const memories: Memory[] = amsMemories.map(mem => ({
      id: mem.id,
      content: mem.text,
      createdAt: mem.created_at,
      topics: mem.topics
    }))

    invocationContext.log(`Found ${memories.length} long-term memories for podbot.${username}`)
    return memories
  } catch (error) {
    invocationContext.error(`Error fetching long-term memories for podbot.${username}`, error)
    return []
  }
}

/**
 * Fetch context from AMS (summary + recent messages + relevant memories)
 */
async function fetchContext(
  username: string,
  sessionId: string,
  invocationContext: InvocationContext
): Promise<Context> {
  try {
    const { context, messages, memories } = await readWorkingMemory('podbot', username, sessionId, invocationContext)

    return {
      summary: context ?? '',
      recentMessages: messages.map(msg => ({
        role: amsRoleToRole(msg.role),
        content: msg.content
      })),
      relevantMemories: memories.map(mem => ({
        id: mem.id,
        content: mem.text,
        createdAt: mem.created_at,
        topics: mem.topics
      }))
    }
  } catch (error) {
    invocationContext.error(`Error fetching context for podbot.${username}.${sessionId}`, error)
    return {
      summary: '',
      recentMessages: [],
      relevantMemories: []
    }
  }
}

/**
 * Convert AMS role to domain Role enum
 */
function amsRoleToRole(role: AMS_Role): Role {
  switch (role) {
    case AMS_Role.USER:
      return Role.USER
    case AMS_Role.ASSISTANT:
      return Role.PODBOT
    default:
      throw new Error(`Unknown AMS role: ${role}`)
  }
}

/**
 * Convert Redis role string to domain Role enum
 */
function roleStringToRole(role?: string): Role {
  if (!role) throw new Error('Redis role is missing or null')

  switch (role) {
    case 'user':
      return Role.USER
    case 'podbot':
      return Role.PODBOT
    default:
      throw new Error(`Unknown Redis role: ${role}`)
  }
}

/**
 * Convert LLM role to AMS role
 * System messages cannot be stored in AMS
 */
function llmRoleToAmsRole(role: LLM_Role): AMS_Role {
  switch (role) {
    case LLM_Role.USER:
      return AMS_Role.USER
    case LLM_Role.ASSISTANT:
      return AMS_Role.ASSISTANT
    case LLM_Role.SYSTEM:
      throw new Error('System messages cannot be stored in AMS')
    default:
      throw new Error(`Unknown LLM role: ${role}`)
  }
}

/**
 * Convert AMS role to LLM role
 */
function amsRoleToLlmRole(role: AMS_Role): LLM_Role {
  switch (role) {
    case AMS_Role.USER:
      return LLM_Role.USER
    case AMS_Role.ASSISTANT:
      return LLM_Role.ASSISTANT
    default:
      throw new Error(`Unknown AMS role: ${role}`)
  }
}
