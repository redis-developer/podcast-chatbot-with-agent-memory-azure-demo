import AppState from '@state/app-state.svelte'
import ChatState from '@state/chat-state.svelte'
import SessionState from '@state/session-state.svelte'
import UserState from '@state/user-state.svelte'
import type { ChatMessage } from '@state/chat-state.svelte'

export default class ChatViewModel {
  static #instance: ChatViewModel

  #appState: AppState
  #chatState: ChatState
  #sessionState: SessionState
  #userState: UserState

  #currentMessage = $state('')

  private constructor() {
    this.#appState = AppState.instance
    this.#chatState = ChatState.instance
    this.#sessionState = SessionState.instance
    this.#userState = UserState.instance
  }

  static get instance(): ChatViewModel {
    return this.#instance ?? (this.#instance = new ChatViewModel())
  }

  get currentMessage(): string {
    return this.#currentMessage
  }

  set currentMessage(value: string) {
    this.#currentMessage = value
  }

  get hasCurrentMessage(): boolean {
    return this.#currentMessage.trim().length > 0
  }

  get username(): string | null {
    return this.#userState.username
  }

  get messages(): ChatMessage[] {
    return this.#chatState.messages
  }

  get messageCount(): number {
    return this.#chatState.messageCount
  }

  sendMessage = async (): Promise<void> => {
    const message = this.#currentMessage.trim()

    const sessionId = this.#sessionState.currentSessionId
    const username = this.#userState.username
    if (!sessionId || !username) return

    this.#currentMessage = ''

    this.#appState.showOverlay()
    try {
      await this.#chatState.sendMessage(sessionId, username, message)
    } finally {
      this.#appState.hideOverlay()
    }
  }

  async loadMessages(): Promise<void> {
    const sessionId = this.#sessionState.currentSessionId
    const username = this.#userState.username
    if (!sessionId || !username) return

    this.#appState.showOverlay()
    try {
      await this.#chatState.loadMessages(sessionId, username)
    } finally {
      this.#appState.hideOverlay()
    }
  }
}
