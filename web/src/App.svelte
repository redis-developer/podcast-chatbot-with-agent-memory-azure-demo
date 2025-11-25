<script lang="ts">
  import AppRouter, { Route } from '@src/app-router.svelte'
  import AppState from '@state/app-state.svelte'
  import Header from '@components/header/Header.svelte'
  import Footer from '@components/Footer.svelte'
  import BusyOverlay from '@components/BusyOverlay.svelte'
  import LoginView from '@views/LoginView.svelte'
  import ChatView from '@views/ChatView.svelte'
  import ContextView from '@views/ContextView.svelte'
  import MemoryView from '@views/MemoryView.svelte'

  const appRouter = AppRouter.instance
  const appState = AppState.instance
</script>

<Header />

<main class="flex-1 flex min-h-0 relative">
  {#if appRouter.currentRoute === Route.Login}
    <LoginView />
  {:else if appRouter.currentRoute === Route.Chat}
    <ChatView />
  {:else if appRouter.currentRoute === Route.Context}
    <ContextView />
  {:else if appRouter.currentRoute === Route.Memory}
    <MemoryView />
  {:else}
    <div class="flex-1 flex items-center justify-center">
      <p class="text-xl text-redis-hyper">Unknown route</p>
    </div>
  {/if}
</main>

<Footer />

{#if appState.displayOverlay}
  <BusyOverlay />
{/if}
