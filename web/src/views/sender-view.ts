const messageInput = document.querySelector('#message-input') as HTMLInputElement
const sendButton = document.querySelector('#send-message') as HTMLButtonElement
const messageForm = document.querySelector('.input-group') as HTMLFormElement

export class SenderView extends EventTarget {
  #disabled = false

  constructor() {
    super()

    sendButton.addEventListener('click', () => this.#onSendClicked())
    messageForm.addEventListener('submit', event => this.#onMessageFormSubmitted(event))
    messageInput.addEventListener('input', () => this.#onMessageChanged())
    messageInput.addEventListener('keypress', event => this.#onMessageKeyPressed(event))

    this.#updateButtonState()
  }

  #onSendClicked(): void {
    this.#sendMessageEvent()
  }

  #onMessageFormSubmitted(event: Event): void {
    event.preventDefault()
    this.#sendMessageEvent()
  }

  #onMessageKeyPressed(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.#sendMessageEvent()
    }
  }

  #onMessageChanged(): void {
    this.#updateButtonState()
  }

  get message(): string {
    return messageInput.value.trim()
  }

  get disabled(): boolean {
    return this.#disabled || this.message.length === 0
  }

  set disabled(value: boolean) {
    if (this.#disabled === value) return
    this.#disabled = value
    this.#updateButtonState()
  }

  clearInput(): void {
    messageInput.value = ''
  }

  focus(): void {
    messageInput.focus()
  }

  #updateButtonState(): void {
    const stateChanged = sendButton.disabled !== this.disabled
    sendButton.disabled = this.disabled
    if (stateChanged) this.dispatchEvent(new Event(this.disabled ? 'disabled' : 'enabled'))
  }

  #sendMessageEvent(): void {
    if (this.disabled) return
    this.dispatchEvent(new Event('send'))
  }
}
