import AppRouter from '@src/app-router.svelte'
import AppState from '@state/app-state.svelte'
import UserState from '@state/user-state.svelte'
import SessionState from '@state/session-state.svelte'

export default class LoginViewModel {
  static #instance: LoginViewModel

  // Local UI state
  #username = $state('')
  #password = $state('')
  #hasLoginError = $state(false)

  #appRouter: AppRouter
  #appState: AppState
  #userState: UserState
  #sessionState: SessionState

  private constructor() {
    this.#userState = UserState.instance
    this.#appState = AppState.instance
    this.#appRouter = AppRouter.instance
    this.#sessionState = SessionState.instance
  }

  static get instance(): LoginViewModel {
    return this.#instance ?? (this.#instance = new LoginViewModel())
  }

  get username(): string {
    return this.#username
  }

  set username(value: string) {
    this.#username = value
  }

  get password(): string {
    return this.#password
  }

  set password(value: string) {
    this.#password = value
  }

  get hasLoginError(): boolean {
    return this.#hasLoginError
  }

  get trimmedUsername(): string {
    return this.#username.trim()
  }

  get canLogin(): boolean {
    return !!(this.trimmedUsername && this.#password)
  }

  // Actions
  handleLogin = async (event: Event): Promise<void> => {
    event.preventDefault()

    this.#appState.showOverlay()
    try {
      const success = await this.#userState.login(this.trimmedUsername, this.#password)
      if (success) {
        await this.#handleLoginSuccess()
      } else {
        this.#handleLoginFailure()
      }
    } finally {
      this.#appState.hideOverlay()
    }
  }

  #handleLoginSuccess = async (): Promise<void> => {
    this.#hasLoginError = false

    // Load sessions for the user
    await this.#sessionState.loadSessions(this.trimmedUsername)

    // If no sessions exist, create one
    if (!this.#sessionState.hasSessions) {
      await this.#sessionState.createSession(this.trimmedUsername)
    }

    // Clear form
    this.#username = ''
    this.#password = ''

    // Navigate to chat
    this.#appRouter.routeToChat()
  }

  #handleLoginFailure(): void {
    this.#hasLoginError = true

    // Clear password
    this.#password = ''
  }
}
