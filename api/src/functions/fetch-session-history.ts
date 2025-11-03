import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import type { ChatMessage } from '@services/chat-service.js'
import { fetchHistory } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function fetchSessionHistory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Get username from route parameters
    const username = request.params.username
    if (!username) return responses.badRequest('Username is required')

    // Fetch chat history
    context.log(`Fetching history for user: ${username}`)
    const chatHistory: ChatMessage[] = await fetchHistory(username)

    // Return chat history
    return responses.ok(chatHistory)
  } catch (error) {
    context.error('Error getting session:', error)
    return responses.serverError('Failed to get session')
  }
}
