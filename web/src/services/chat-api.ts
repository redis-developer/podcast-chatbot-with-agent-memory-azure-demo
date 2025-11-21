export type ChatRequest = {
  message: string
}

export type ChatResponse = {
  response: string
}

export type HistoryResponse = Array<{
  role: string
  content: string
}>

export class ChatApi {
  async fetchSessionHistory(sessionId: string, username: string): Promise<HistoryResponse> {
    const url = this.#buildUrl(sessionId, username)
    const options = this.#buildOptions('GET')
    const response = await fetch(url, options)
    this.#validateResponse(response)
    return (await response.json()) as HistoryResponse
  }

  async sendMessage(sessionId: string, username: string, request: ChatRequest): Promise<ChatResponse> {
    const url = this.#buildUrl(sessionId, username)
    const options = this.#buildOptions('POST', request)
    const response = await fetch(url, options)
    this.#validateResponse(response)
    return (await response.json()) as ChatResponse
  }

  async clearSession(sessionId: string, username: string): Promise<void> {
    const url = this.#buildUrl(sessionId, username)
    const options = this.#buildOptions('DELETE')
    const response = await fetch(url, options)
    this.#validateResponse(response)
  }

  #buildUrl(sessionId: string, username: string): string {
    return `/api/sessions/${sessionId}/${username}`
  }

  #buildOptions(method: string, body?: ChatRequest): RequestInit {
    const options: RequestInit = {}
    options.method = method
    options.headers = { 'Content-Type': 'application/json' }
    if (body) options.body = JSON.stringify(body)
    return options
  }

  #validateResponse(response: Response): void {
    if (!response.ok) throw new Error(`API request failed (${response.status}): ${response.statusText}`)
  }
}
