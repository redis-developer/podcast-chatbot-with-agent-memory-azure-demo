// Session types
export type Session = {
  id: string
  lastActive: string // ISO 8601 date string
}

// Chat types
export type ChatMessage = {
  role: 'user' | 'podbot'
  content: string
}

// Context message types (from AMS)
export type ContextMessage = {
  role: 'user' | 'podbot'
  content: string
}

// Memory types
export type Memory = {
  id: string
  content: string
  createdAt: string // ISO 8601 date string
}

// Context types
export type Context = {
  summary: string // Summarized old conversation
  recentMessages: ContextMessage[] // Recent messages for reference (from AMS)
  relevantMemories: Memory[] // LTM relevant to this conversation
}

// Combined response for chat operations
export type ChatWithContext = {
  chatHistory: ChatMessage[] // Complete chat from Redis Stream
  context: Context // AMS working memory
}

// ========== Session Management ==========

export async function createSession(username: string): Promise<Session> {
  const url = `/api/sessions/${username}`
  const options = buildOptions('POST')
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as Session
}

export async function fetchSessions(username: string): Promise<Session[]> {
  const url = `/api/sessions/${username}`
  const options = buildOptions('GET')
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as Session[]
}

// ========== Chat + Context (Combined) ==========

export async function fetchSession(username: string, sessionId: string): Promise<ChatWithContext> {
  const url = `/api/sessions/${username}/${sessionId}`
  const options = buildOptions('GET')
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as ChatWithContext
}

export async function sendMessage(username: string, sessionId: string, message: string): Promise<ChatWithContext> {
  const url = `/api/sessions/${username}/${sessionId}`
  const request = { message }
  const options = buildOptions('POST', request)
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as ChatWithContext
}

// ========== Memories (AMS Long-Term Memory) ==========

export async function fetchMemories(username: string): Promise<Memory[]> {
  const url = `/api/memories/${username}`
  const options = buildOptions('GET')
  const response = await fetch(url, options)
  validateResponse(response)
  return (await response.json()) as Memory[]
}

// ========== Helper Functions ==========

function buildOptions(method: string, body?: unknown): RequestInit {
  const options: RequestInit = {}
  options.method = method
  options.headers = { 'Content-Type': 'application/json' }
  if (body) options.body = JSON.stringify(body)
  return options
}

function validateResponse(response: Response): void {
  if (!response.ok) throw new Error(`API request failed (${response.status}): ${response.statusText}`)
}
