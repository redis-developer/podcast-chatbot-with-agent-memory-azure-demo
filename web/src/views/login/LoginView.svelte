<script lang="ts">
  import { ulid } from 'ulid'
  import AppState from '@app/app-state.svelte.ts'
  import AppRouter from '@app/app-router.svelte.ts'

  const appState = AppState.instance
  const appRouter = AppRouter.instance

  let username = $state('')
  let password = $state('')

  function handleLogin(event: Event) {
    event.preventDefault()

    if (!username.trim()) return

    appState.username = username.trim()
    appState.sessionId = ulid()
    appRouter.routeToChat()
  }
</script>

<div class="flex-1 flex flex-col items-center justify-center p-6">
  <div class="max-w-md w-full">
    <form onsubmit={handleLogin} class="bg-redis-white dark:bg-redis-black border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-8 space-y-6">
      <div>
        <label for="username" class="block text-sm font-semibold mb-2 text-redis-black dark:text-redis-white">
          Username
        </label>
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="Enter your username"
          class="w-full bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-sans text-base rounded-lg focus:outline-none focus:border-redis-hyper"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-semibold mb-2 text-redis-black dark:text-redis-white">
          Password
        </label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          class="w-full bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-sans text-base rounded-lg focus:outline-none focus:border-redis-hyper"
          required
        />
      </div>

      <button
        type="submit"
        disabled={!username.trim() || !password.trim()}
        class="w-full bg-redis-hyper hover:bg-redis-deep-hyper border-2 border-redis-hyper hover:border-redis-deep-hyper text-white px-4 py-3 font-sans text-base font-semibold cursor-pointer rounded-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-px focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,68,56,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        <i class="fa-solid fa-right-to-bracket"></i>
        <span>Login</span>
      </button>
    </form>

    <div class="mt-8 bg-redis-violet-20 dark:bg-redis-dusk border-l-4 border-redis-violet rounded-lg p-4">
      <p class="text-sm text-redis-black dark:text-redis-white">
        <i class="fa-solid fa-info-circle text-redis-violet mr-2"></i>
        Enter any username and password to get started. Password is required but will be ignored.
      </p>
    </div>
  </div>
</div>
