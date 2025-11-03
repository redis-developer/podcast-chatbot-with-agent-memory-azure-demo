import type { HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions'

import { clearSession } from '@services/chat-service.js'
import responses from './http-responses.js'

export async function deleteSession(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Get username from route parameters
    const username = request.params.username
    if (!username) return responses.badRequest('Username is required')

    // Clear chat history for the user
    context.log(`Clearing session for user: ${username}`)
    await clearSession(username)

    // Return success response
    return responses.ok({ success: true })
  } catch (error) {
    context.error('Error clearing session:', error)
    return responses.serverError('Failed to clear session')
  }
}
