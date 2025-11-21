import { ChatApi, type HistoryResponse } from './chat-api'
import type { ChatMessage } from '@app/app-state.svelte'

export class ChatService {
  #api: ChatApi

  constructor() {
    this.#api = new ChatApi()
  }

  async fetchHistory(sessionId: string, username: string): Promise<ChatMessage[]> {
    const history = await this.#api.fetchSessionHistory(sessionId, username)
    return this.#convertHistoryToMessages(history)
  }

  async sendMessage(sessionId: string, username: string, message: string): Promise<string> {
    const response = await this.#api.sendMessage(sessionId, username, { message })
    return response.response
  }

  async clearSession(sessionId: string, username: string): Promise<void> {
    await this.#api.clearSession(sessionId, username)
  }

  #convertHistoryToMessages(history: HistoryResponse): ChatMessage[] {
    return history.map(item => {
      if (item.role === 'summary') {
        return { role: 'summary', content: item.content }
      } else if (item.role === 'user') {
        return { role: 'user', content: item.content }
      } else {
        return { role: 'podbot', content: item.content }
      }
    })
  }
}
