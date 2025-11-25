import UserState from '@state/user-state.svelte'
import SessionState from '@state/session-state.svelte'
import ContextState from '@state/context-state.svelte'
import AppState from '@state/app-state.svelte'
import type { ContextMessage } from '@state/context-state.svelte'

export default class ContextViewModel {
  static #instance: ContextViewModel

  #appState: AppState
  #contextState: ContextState
  #sessionState: SessionState
  #userState: UserState

  private constructor() {
    this.#appState = AppState.instance
    this.#contextState = ContextState.instance
    this.#sessionState = SessionState.instance
    this.#userState = UserState.instance
  }

  static get instance(): ContextViewModel {
    return this.#instance ?? (this.#instance = new ContextViewModel())
  }

  get summary(): string {
    return this.#contextState.summary
  }

  get hasSummary(): boolean {
    return this.#contextState.hasSummary
  }

  get messages(): ContextMessage[] {
    return this.#contextState.messages
  }

  get hasMessages(): boolean {
    return this.#contextState.messageCount > 0
  }

  get messageCount(): number {
    return this.#contextState.messageCount
  }

  async loadContext(): Promise<void> {
    const sessionId = this.#sessionState.currentSessionId
    const username = this.#userState.username
    if (!sessionId || !username) return

    this.#appState.showOverlay()
    try {
      await this.#contextState.loadContext(sessionId, username)
    } finally {
      this.#appState.hideOverlay()
    }
  }
}
