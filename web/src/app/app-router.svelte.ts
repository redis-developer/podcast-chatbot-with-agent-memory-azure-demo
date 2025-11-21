export enum Route {
  Login = 'login',
  Chat = 'chat',
  Session = 'session',
  Memory = 'memory'
}

export default class AppRouter {
  static #instance: AppRouter
  #currentRoute = $state<Route>(Route.Login)

  private constructor() {}

  static get instance() {
    return this.#instance ?? (this.#instance = new AppRouter())
  }

  get currentRoute(): Route {
    return this.#currentRoute
  }

  routeToLogin() {
    this.#currentRoute = Route.Login
  }

  routeToChat() {
    this.#currentRoute = Route.Chat
  }

  routeToSession() {
    this.#currentRoute = Route.Session
  }

  routeToMemory() {
    this.#currentRoute = Route.Memory
  }
}
