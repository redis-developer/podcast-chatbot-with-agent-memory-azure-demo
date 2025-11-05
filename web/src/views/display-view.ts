import { marked } from 'marked'
import { type ChatMessage, ChatRole } from '../model'

const messageHistory = document.querySelector('#message-history') as HTMLElement
const mainContainer = document.querySelector('main') as HTMLElement
const usernameInput = document.querySelector('#username') as HTMLInputElement

export class DisplayView {
  #loading = false
  #loadingElement: HTMLDivElement | null = null

  get loading(): boolean {
    return this.#loading
  }

  set loading(value: boolean) {
    if (this.#loading === value) return
    this.#loading = value

    if (this.#loading) {
      this.#showLoadingIndicator()
    } else {
      this.#hideLoadingIndicator()
    }
  }

  displayMessage(message: ChatMessage): void {
    const item = this.#buildChatMessage(message)
    messageHistory.appendChild(item)
    this.#scrollToBottom()
  }

  displayError(error: Error): void {
    const item = this.#buildErrorMessage(error)
    messageHistory.appendChild(item)
    this.#scrollToBottom()
  }

  clearHistory(): void {
    messageHistory.innerHTML = ''
  }

  #buildChatMessage(message: ChatMessage): HTMLLIElement {
    switch (message.role) {
      case ChatRole.USER:
        return this.#buildUserMessage(message.content)
      case ChatRole.PODBOT:
        return this.#buildPodbotMessage(message.content)
      case ChatRole.SUMMARY:
        return this.#buildSummaryMessage(message.content)
    }
  }

  #buildErrorMessage(error: Error): HTMLLIElement {
    const contentDiv = this.#buildTextContent(`Error: ${error.message}`)
    return this.#buildMessageItem('system-message', contentDiv)
  }

  #buildUserMessage(content: string): HTMLLIElement {
    const entity = this.#buildEntity(`${usernameInput.value.trim() ?? 'you'}> `)
    const contentDiv = this.#buildTextContent(content)
    return this.#buildMessageItem(['message', 'user-message'], [entity, contentDiv])
  }

  #buildPodbotMessage(content: string): HTMLLIElement {
    const entity = this.#buildEntity('PodBot> ')
    const contentDiv = this.#buildMarkdownContent(content)
    return this.#buildMessageItem(['message', 'bot-message'], [entity, contentDiv])
  }

  #buildSummaryMessage(content: string): HTMLLIElement {
    const entity = this.#buildEntity('Context> ')
    const contentDiv = this.#buildTextContent(content)
    return this.#buildMessageItem(['message', 'summary-message'], [entity, contentDiv])
  }

  #buildEntity(text: string): HTMLSpanElement {
    const entity = document.createElement('span')
    entity.className = 'username'
    entity.textContent = text
    return entity
  }

  #buildTextContent(content: string): HTMLDivElement {
    const contentDiv = document.createElement('div')
    contentDiv.textContent = content
    return contentDiv
  }

  #buildMarkdownContent(content: string): HTMLDivElement {
    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = marked.parse(content) as string
    return contentDiv
  }

  #buildMessageItem(classOrClasses: string | string[], childOrChildren: HTMLElement | HTMLElement[]): HTMLLIElement {
    const classes = Array.isArray(classOrClasses) ? classOrClasses : [classOrClasses]
    const children = Array.isArray(childOrChildren) ? childOrChildren : [childOrChildren]

    const item = document.createElement('li')
    classes.forEach(className => item.classList.add(className))
    children.forEach(child => item.appendChild(child))

    return item
  }

  #scrollToBottom(): void {
    mainContainer.scrollTop = mainContainer.scrollHeight
  }

  #showLoadingIndicator(): void {
    if (this.#loadingElement) return

    // Create overlay
    const overlay = document.createElement('div')
    overlay.className = 'loading-overlay'

    // Create Font Awesome compact disc icon
    const spinner = document.createElement('i')
    spinner.className = 'fas fa-compact-disc fa-spin fa-3x'

    overlay.appendChild(spinner)
    this.#loadingElement = overlay
    mainContainer.appendChild(this.#loadingElement)
  }

  #hideLoadingIndicator(): void {
    if (!this.#loadingElement) return

    this.#loadingElement.remove()
    this.#loadingElement = null
  }
}
