import { processMessage } from '../services/chat-service.js';
import responses from './http-responses.js';
export async function requestAndResponse(request, context) {
    try {
        // Get username from route parameters
        const username = request.params.username;
        if (!username)
            return responses.badRequest('Username is required');
        // Get user message from request body
        const body = await request.json();
        const { message } = body;
        if (!message)
            return responses.badRequest('Message is required');
        // Process the message
        context.log(`Processing message for user: ${username}`);
        const response = await processMessage(username, message);
        // Return the response
        return responses.ok({ response });
    }
    catch (error) {
        context.error('Error processing chat:', error);
        return responses.serverError('Failed to process chat');
    }
}
//# sourceMappingURL=request-and-response.js.map