import * as sessionService from '@services/session-service'
import type { Session } from '@services/session-service'

export type { Session }

export default class SessionState {
  static #instance: SessionState

  #sessions = $state<Session[]>([])
  #currentSessionId = $state<string | null>(null)

  private constructor() {}

  static get instance(): SessionState {
    return this.#instance ?? (this.#instance = new SessionState())
  }

  get sessions(): Session[] {
    return this.#sessions
  }

  get currentSessionId(): string | null {
    return this.#currentSessionId
  }

  get hasSessions(): boolean {
    return this.#sessions.length > 0
  }

  selectSession(id: string) {
    this.#currentSessionId = id
  }

  async createSession(username: string): Promise<void> {
    try {
      const session = await sessionService.createSession(username)
      this.#sessions.unshift(session)
      this.selectSession(session.id)
    } catch (error) {
      console.error('Failed to create session:', error)
    }
  }

  async loadSessions(username: string): Promise<void> {
    try {
      this.#sessions = await sessionService.loadSessions(username)
      if (this.hasSessions && !this.currentSessionId) this.selectSession(this.#sessions[0].id)
    } catch (error) {
      console.error('Failed to load sessions:', error)
      this.#sessions = []
    }
  }
}
