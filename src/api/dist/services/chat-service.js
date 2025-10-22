import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { config } from '../config.js';
import { generateResponse } from './agent-adapter.js';
import { readWorkingMemory, replaceWorkingMemory, removeWorkingMemory, AmsRole } from './memory-server.js';
var ChatRole;
(function (ChatRole) {
    ChatRole["SUMMARY"] = "summary";
    ChatRole["USER"] = "user";
    ChatRole["PODBOT"] = "podbot";
})(ChatRole || (ChatRole = {}));
export async function fetchHistory(username) {
    try {
        // Get existing AMS working memory
        const { context, messages } = await readWorkingMemory(username, 'chat');
        // Convert to chat message format
        const contextMessage = context ? amsContextToChatMessage(context) : undefined;
        const chatMessages = messages.map(amsToChatMessage);
        const chatHistory = contextMessage ? [contextMessage, ...chatMessages] : chatMessages;
        // Return the chat history
        return chatHistory;
    }
    catch (error) {
        console.error('Error reading working memory:', error);
        return [];
    }
}
export async function processMessage(username, message) {
    try {
        // Get existing AMS working memory
        const { context, messages } = await readWorkingMemory(username, 'chat');
        // Convert to LangChain message format
        const contextMessage = context ? new SystemMessage(`Previous conversation context: ${context}`) : undefined;
        const chatMessages = messages.map(amsToLangChainMessage);
        const userMessage = new HumanMessage(message);
        const langChainMessages = contextMessage
            ? [contextMessage, ...chatMessages, userMessage]
            : [...chatMessages, userMessage];
        // Get AI response
        const aiMessage = await generateResponse(langChainMessages);
        const aiText = aiMessage.text;
        // Convert back to AMS format and save
        const amsUserMessage = langchainToAmsMessage(userMessage);
        const amsAiMessage = langchainToAmsMessage(aiMessage);
        const amsMessages = [...messages, amsUserMessage, amsAiMessage];
        // Save updated working memory
        await replaceWorkingMemory(username, config.amsContextWindowMax, {
            session_id: username,
            namespace: 'chat',
            context: context,
            messages: amsMessages
        });
        // Return AI response
        return aiText;
    }
    catch (error) {
        console.error('Error processing message:', error);
        return `Error processing message: ${error}`;
    }
}
export async function clearSession(username) {
    try {
        await removeWorkingMemory(username, 'chat');
    }
    catch (error) {
        console.error('Error clearing session:', error);
    }
}
function amsToLangChainMessage(amsMessage) {
    switch (amsMessage.role) {
        case AmsRole.USER:
            return new HumanMessage(amsMessage.content);
        case AmsRole.ASSISTANT:
            return new AIMessage(amsMessage.content);
        default:
            throw new Error(`Unknown AMS role: ${amsMessage.role}`);
    }
}
function amsContextToChatMessage(context) {
    return { role: ChatRole.SUMMARY, content: context };
}
function amsToChatMessage(message) {
    switch (message.role) {
        case AmsRole.USER:
            return { role: ChatRole.USER, content: message.content };
        case AmsRole.ASSISTANT:
            return { role: ChatRole.PODBOT, content: message.content };
        default:
            throw new Error(`Unknown AMS role: ${message.role}`);
    }
}
function langchainToAmsMessage(message) {
    switch (message.constructor) {
        case AIMessage:
            return { role: AmsRole.ASSISTANT, content: message.text };
        case HumanMessage:
            return { role: AmsRole.USER, content: message.text };
        case SystemMessage:
            throw new Error('SystemMessage cannot be converted to AmsMessage');
        default:
            throw new Error(`Unknown LangChain message type: ${message.constructor.name}`);
    }
}
//# sourceMappingURL=chat-service.js.map