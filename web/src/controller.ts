import { DisplayView } from './views/display-view'
import { SessionView } from './views/session-view'
import { SenderView } from './views/sender-view'
import { fetchSessionHistory, sendMessage, clearSession, ChatRole, type ChatMessage } from './model'

export class AppController {
  #displayView: DisplayView
  #sessionView: SessionView
  #senderView: SenderView

  constructor() {
    this.#displayView = new DisplayView()
    this.#sessionView = new SessionView()
    this.#senderView = new SenderView()
  }

  start(): void {
    this.#sessionView.addEventListener('load', () => this.#onSessionLoad())
    this.#sessionView.addEventListener('clear', () => this.#onSessionClear())
    this.#sessionView.addEventListener('enabled', () => this.#onSessionEnabled())
    this.#sessionView.addEventListener('disabled', () => this.#onSessionDisabled())
    this.#senderView.addEventListener('send', () => this.#onMessageSend())

    this.#setInitialFocus()
  }

  async #onSessionLoad(): Promise<void> {
    const username = this.#sessionView.username

    this.#disableUI()

    try {
      const messages = await fetchSessionHistory(username)
      this.#displayView.clearHistory()
      messages.forEach(message => this.#displayView.displayMessage(message))
    } catch (error) {
      this.#displayView.displayError(error as Error)
    }

    this.#enableUI()
  }

  async #onSessionClear(): Promise<void> {
    const username = this.#sessionView.username

    const confirmed = confirm(`Are you sure you want to clear the session for ${username}?`)
    if (!confirmed) return

    this.#disableUI()

    try {
      await clearSession(username)
      this.#displayView.clearHistory()
    } catch (error) {
      this.#displayView.displayError(error as Error)
    }

    this.#enableUI()
  }

  #onSessionEnabled(): void {
    this.#senderView.disabled = false
  }

  #onSessionDisabled(): void {
    this.#senderView.disabled = true
  }

  async #onMessageSend(): Promise<void> {
    const message = this.#senderView.message
    const username = this.#sessionView.username

    this.#senderView.clearInput()
    this.#disableUI()

    const userMessage: ChatMessage = { role: ChatRole.USER, content: message }
    this.#displayView.displayMessage(userMessage)

    try {
      const response = await sendMessage(username, message)
      const botMessage: ChatMessage = { role: ChatRole.PODBOT, content: response.response }
      this.#displayView.displayMessage(botMessage)
    } catch (error) {
      this.#displayView.displayError(error as Error)
    }

    this.#enableUI()
  }

  #setInitialFocus(): void {
    if (this.#sessionView.username) {
      this.#senderView.focus()
    } else {
      this.#sessionView.focus()
    }
  }

  #disableUI(): void {
    this.#sessionView.disabled = true
    this.#senderView.disabled = true
    this.#displayView.loading = true
  }

  #enableUI(): void {
    this.#displayView.loading = false
    this.#sessionView.disabled = false
    this.#senderView.disabled = false
  }
}
