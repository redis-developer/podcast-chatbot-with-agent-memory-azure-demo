<script lang="ts">
  import AppState from '@app/app-state.svelte.ts'
  import AppRouter, { Route } from '@app/app-router.svelte.ts'

  const appState = AppState.instance
  const appRouter = AppRouter.instance

  function handleLogout() {
    appState.logout()
    appRouter.routeToLogin()
  }

  function isActive(route: Route): string {
    return appRouter.currentRoute === route
      ? 'text-gray-400 cursor-default'
      : 'text-redis-black dark:text-redis-white hover:text-redis-hyper cursor-pointer'
  }
</script>

{#if appState.isLoggedIn}
  <div class="flex items-center gap-2">
    <button
      type="button"
      onclick={() => appRouter.routeToChat()}
      class="p-2 transition-colors {isActive(Route.Chat)}"
      title="Chat"
    >
      <i class="fa-solid fa-comments text-lg"></i>
    </button>

    <button
      type="button"
      onclick={() => appRouter.routeToSession()}
      class="p-2 transition-colors {isActive(Route.Session)}"
      title="Working Memory"
    >
      <i class="fa-solid fa-note-sticky text-lg"></i>
    </button>

    <button
      type="button"
      onclick={() => appRouter.routeToMemory()}
      class="p-2 transition-colors {isActive(Route.Memory)}"
      title="Long-term Memory"
    >
      <i class="fa-solid fa-brain text-lg"></i>
    </button>

    <div class="w-px h-6 bg-redis-black-30 dark:bg-redis-dusk-70 mx-2"></div>

    <button
      type="button"
      onclick={handleLogout}
      class="p-2 text-redis-black dark:text-redis-white hover:text-redis-hyper transition-colors cursor-pointer"
      title="Logout"
    >
      <i class="fa-solid fa-right-from-bracket text-lg"></i>
    </button>
  </div>
{/if}
