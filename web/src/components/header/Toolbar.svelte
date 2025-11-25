<script lang="ts">
  import { Route } from '@src/app-router.svelte'
  import HeaderViewModel from './header-view-model.svelte'

  const viewModel = HeaderViewModel.instance

  const ACTIVE_CLASS = 'p-2 transition-colors text-gray-400 cursor-default'
  const INACTIVE_CLASS =
    'p-2 transition-colors text-redis-black dark:text-redis-white hover:text-redis-hyper cursor-pointer'

  const chatButtonClass = $derived(viewModel.isActiveRoute(Route.Chat) ? ACTIVE_CLASS : INACTIVE_CLASS)
  const contextButtonClass = $derived(viewModel.isActiveRoute(Route.Context) ? ACTIVE_CLASS : INACTIVE_CLASS)
  const memoryButtonClass = $derived(viewModel.isActiveRoute(Route.Memory) ? ACTIVE_CLASS : INACTIVE_CLASS)
  const logoutButtonClass = INACTIVE_CLASS
</script>

{#if viewModel.isLoggedIn}
  <div class="flex items-center gap-2">
    <button type="button" onclick={viewModel.navigateToChat} class={chatButtonClass} title="Chat">
      <i class="fa-solid fa-comments text-lg"></i>
    </button>

    <button type="button" onclick={viewModel.navigateToContext} class={contextButtonClass} title="Context">
      <i class="fa-solid fa-note-sticky text-lg"></i>
    </button>

    <button type="button" onclick={viewModel.navigateToMemory} class={memoryButtonClass} title="Memory">
      <i class="fa-solid fa-brain text-lg"></i>
    </button>

    <div class="w-px h-6 bg-redis-black-30 dark:bg-redis-dusk-70 mx-2"></div>

    <span class="text-sm text-redis-black dark:text-redis-white font-mono">
      Logged in as <span class="text-redis-hyper">{viewModel.username}</span>
    </span>

    <button type="button" onclick={viewModel.logout} class={logoutButtonClass} title="Logout">
      <i class="fa-solid fa-right-from-bracket text-lg"></i>
    </button>
  </div>
{/if}
