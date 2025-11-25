import AppRouter, { Route } from '@src/app-router.svelte'
import UserState from '@state/user-state.svelte'

export default class HeaderViewModel {
  static #instance: HeaderViewModel

  #appRouter: AppRouter
  #userState: UserState

  private constructor() {
    this.#appRouter = AppRouter.instance
    this.#userState = UserState.instance
  }

  static get instance(): HeaderViewModel {
    return this.#instance ?? (this.#instance = new HeaderViewModel())
  }

  get username(): string | null {
    return this.#userState.username
  }

  get isLoggedIn(): boolean {
    return this.#userState.isLoggedIn
  }

  get currentRoute(): Route {
    return this.#appRouter.currentRoute
  }

  navigateToChat = (): void => {
    this.#appRouter.routeToChat()
  }

  navigateToContext = (): void => {
    this.#appRouter.routeToContext()
  }

  navigateToMemory = (): void => {
    this.#appRouter.routeToMemory()
  }

  logout = (): void => {
    this.#userState.logout()
    this.#appRouter.routeToLogin()
  }

  isActiveRoute(route: Route): boolean {
    return this.#appRouter.currentRoute === route
  }
}
