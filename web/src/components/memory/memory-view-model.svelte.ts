import AppState from '@state/app-state.svelte'
import MemoryState from '@state/memory-state.svelte'
import UserState from '@state/user-state.svelte'
import type { Memory } from '@state/memory-state.svelte'

export default class MemoryViewModel {
  static #instance: MemoryViewModel

  #appState: AppState
  #memoryState: MemoryState
  #userState: UserState

  private constructor() {
    this.#appState = AppState.instance
    this.#memoryState = MemoryState.instance
    this.#userState = UserState.instance
  }

  static get instance(): MemoryViewModel {
    return this.#instance ?? (this.#instance = new MemoryViewModel())
  }

  get memories(): Memory[] {
    return this.#memoryState.memories
  }

  get hasMemories(): boolean {
    return this.#memoryState.hasMemories
  }

  get memoryCount(): number {
    return this.#memoryState.memoryCount
  }

  async loadMemories(): Promise<void> {
    const username = this.#userState.username
    if (!username) return

    this.#appState.showOverlay()
    try {
      await this.#memoryState.loadMemories(username)
    } finally {
      this.#appState.hideOverlay()
    }
  }
}
