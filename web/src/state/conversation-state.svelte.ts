import {
  fetchSession,
  sendMessage,
  type ChatMessage,
  type ChatWithContext,
  type Context,
  type ContextMessage
} from '@services/podbot-service'

export type { ChatMessage, Context, ContextMessage }

export default class ConversationState {
  static #instance: ConversationState

  #chatHistory = $state<ChatMessage[]>([])
  #context = $state<Context>({ summary: '', recentMessages: [] })

  private constructor() {}

  static get instance(): ConversationState {
    return this.#instance ?? (this.#instance = new ConversationState())
  }

  // ========== Chat History Getters ==========

  get chatHistory(): ChatMessage[] {
    return this.#chatHistory
  }

  get hasChatHistory(): boolean {
    return this.#chatHistory.length > 0
  }

  // ========== Context Getters ==========

  get summary(): string {
    return this.#context.summary
  }

  get hasSummary(): boolean {
    return this.#context.summary.length > 0
  }

  get recentMessages(): ContextMessage[] {
    return this.#context.recentMessages
  }

  get recentMessagesCount(): number {
    return this.recentMessages.length
  }

  get hasRecentMessages(): boolean {
    return this.recentMessagesCount > 0
  }

  // ========== Actions ==========

  async loadConversation(username: string, sessionId: string): Promise<void> {
    try {
      const chatAndContext: ChatWithContext = await fetchSession(username, sessionId)
      this.#chatHistory = chatAndContext.chatHistory
      this.#context = chatAndContext.context
    } catch (error) {
      console.error('Failed to load conversation:', error)
      this.#chatHistory = []
      this.#context = { summary: '', recentMessages: [] }
    }
  }

  async sendMessage(username: string, sessionId: string, content: string): Promise<void> {
    try {
      const chatAndContext: ChatWithContext = await sendMessage(username, sessionId, content)
      this.#chatHistory = chatAndContext.chatHistory
      this.#context = chatAndContext.context
    } catch (error) {
      // On error, show the user's message and the error response
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.#chatHistory.push({ role: 'user', content })
      this.#chatHistory.push({ role: 'assistant', content: `Error: ${errorMessage}` })
    }
  }

  clear(): void {
    this.#chatHistory = []
    this.#context = { summary: '', recentMessages: [] }
  }
}
