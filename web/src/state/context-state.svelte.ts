import * as contextService from '@services/context-service'

export type ContextMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type Context = {
  context: string
  messages: ContextMessage[]
}

export default class ContextState {
  static #instance: ContextState

  #context = $state<Context>({ context: '', messages: [] })

  private constructor() {}

  static get instance(): ContextState {
    return this.#instance ?? (this.#instance = new ContextState())
  }

  get summary(): string {
    return this.#context.context
  }

  get hasSummary(): boolean {
    return this.#context.context.length > 0
  }

  get messages(): ContextMessage[] {
    return this.#context.messages
  }

  get messageCount(): number {
    return this.#context.messages.length
  }

  async loadContext(sessionId: string, username: string): Promise<void> {
    try {
      this.#context = await contextService.loadContext(sessionId, username)
    } catch (error) {
      console.error('Failed to load context:', error)
      this.#context = { context: '', messages: [] }
    }
  }

  clear(): void {
    this.#context = { context: '', messages: [] }
  }
}
