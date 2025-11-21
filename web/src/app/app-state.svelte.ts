export default class AppState {
  static #instance: AppState

  #username = $state<string | null>(null)

  private constructor() {}

  static get instance() {
    return this.#instance ?? (this.#instance = new AppState())
  }

  get username(): string | null {
    return this.#username
  }

  set username(username: string) {
    this.#username = username
  }

  get isLoggedIn(): boolean {
    return this.#username !== null
  }

  logout() {
    this.#username = null
  }
}
