import * as chatService from '@services/chat-service'

export type ChatMessage = {
  role: 'user' | 'podbot'
  content: string
}

export default class ChatState {
  static #instance: ChatState

  #messages = $state<ChatMessage[]>([])

  private constructor() {}

  static get instance(): ChatState {
    return this.#instance ?? (this.#instance = new ChatState())
  }

  get messages(): ChatMessage[] {
    return this.#messages
  }

  get messageCount(): number {
    return this.#messages.length
  }

  async loadMessages(sessionId: string, username: string): Promise<void> {
    try {
      this.#messages = await chatService.loadMessages(sessionId, username)
    } catch (error) {
      console.error('Failed to load messages:', error)
      this.#messages = []
    }
  }

  async sendMessage(sessionId: string, username: string, content: string): Promise<void> {
    try {
      // Add user message immediately
      this.#messages.push({ role: 'user', content })

      // Get bot response from service
      const response = await chatService.sendMessage(sessionId, username, content)

      // Add bot response
      this.#messages.push({
        role: 'podbot',
        content: response
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      this.#messages.push({ role: 'podbot', content: `Error: ${errorMessage}` })
    }
  }
}
