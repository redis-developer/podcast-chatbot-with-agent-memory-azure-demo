const usernameInput = document.querySelector('#username') as HTMLInputElement
const loadButton = document.querySelector('#load-session') as HTMLButtonElement
const clearButton = document.querySelector('#clear-session') as HTMLButtonElement

export class SessionView extends EventTarget {
  #disabled = false

  constructor() {
    super()

    loadButton.addEventListener('click', () => this.#onLoadClicked())
    clearButton.addEventListener('click', () => this.#onClearClicked())
    usernameInput.addEventListener('input', () => this.#onUsernameChanged())

    this.#updateButtonStates()
  }

  #onLoadClicked(): void {
    this.dispatchEvent(new Event('load'))
  }

  #onClearClicked(): void {
    this.dispatchEvent(new Event('clear'))
  }

  #onUsernameChanged(): void {
    this.#updateButtonStates()
  }

  get username(): string {
    return usernameInput.value.trim()
  }

  get disabled(): boolean {
    return this.#disabled || this.username.length === 0
  }

  set disabled(value: boolean) {
    if (this.#disabled === value) return
    this.#disabled = value
    this.#updateButtonStates()
  }

  focus(): void {
    usernameInput.focus()
  }

  #updateButtonStates(): void {
    const stateChanged = loadButton.disabled !== this.disabled || clearButton.disabled !== this.disabled

    loadButton.disabled = this.disabled
    clearButton.disabled = this.disabled

    if (stateChanged) this.dispatchEvent(new Event(this.disabled ? 'disabled' : 'enabled'))
  }
}
