import UserState from '@state/user-state.svelte'
import SessionState from '@state/session-state.svelte'
import type { Session } from '@state/session-state.svelte'

export default class SessionViewModel {
  static #instance: SessionViewModel

  #userState: UserState
  #sessionState: SessionState

  private constructor() {
    this.#userState = UserState.instance
    this.#sessionState = SessionState.instance
  }

  static get instance(): SessionViewModel {
    return this.#instance ?? (this.#instance = new SessionViewModel())
  }

  get sessions(): Session[] {
    return this.#sessionState.sessions
  }

  get currentSessionId(): string | null {
    return this.#sessionState.currentSessionId
  }

  get hasSessions(): boolean {
    return this.#sessionState.hasSessions
  }

  selectSession = (id: string) => this.#sessionState.selectSession(id)

  createSession = async (): Promise<void> => {
    const username = this.#userState.username
    if (!username) return

    await this.#sessionState.createSession(username)
  }
}
