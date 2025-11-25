import * as memoryService from '@services/memory-service'

export type Memory = {
  id: string
  content: string
  created: string
}

export default class MemoryState {
  static #instance: MemoryState

  #memories = $state<Memory[]>([])

  private constructor() {}

  static get instance(): MemoryState {
    return this.#instance ?? (this.#instance = new MemoryState())
  }

  get memories(): Memory[] {
    return this.#memories
  }

  get memoryCount(): number {
    return this.#memories.length
  }

  get hasMemories(): boolean {
    return this.#memories.length > 0
  }

  async loadMemories(username: string): Promise<void> {
    try {
      this.#memories = await memoryService.loadMemories(username)
    } catch (error) {
      console.error('Failed to load memories:', error)
      this.#memories = []
    }
  }

  clear(): void {
    this.#memories = []
  }
}
