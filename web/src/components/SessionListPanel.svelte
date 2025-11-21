<script lang="ts">
  // Stubbed session data for UI development
  const sessions = [
    { id: '01JFG8X9ABCD1234', name: 'History Podcasts', lastActive: '2 hours ago' },
    { id: '01JFG7Y8WXYZ5678', name: 'True Crime Recs', lastActive: 'Yesterday' },
    { id: '01JFG6Z7MNOP9012', name: 'Tech & Science', lastActive: '3 days ago' }
  ]

  let selectedId = $state<string | null>(sessions[0]?.id ?? null)

  function selectSession(id: string) {
    selectedId = id
    // TODO: Wire up to view model to load session data
  }

  function createNewSession() {
    // TODO: Wire up to view model to create new session
    console.log('Create new session')
  }
</script>

<aside class="w-64 bg-redis-white dark:bg-redis-black border-r border-redis-black-10 dark:border-redis-dusk-70 flex flex-col shrink-0">
  <div class="p-4 border-b border-redis-black-10 dark:border-redis-dusk-70">
    <button
      type="button"
      onclick={createNewSession}
      class="w-full bg-redis-hyper hover:bg-redis-deep-hyper text-white px-4 py-2 font-sans text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
    >
      <i class="fa-solid fa-plus"></i>
      <span>New Session</span>
    </button>
  </div>

  <div class="flex-1 overflow-y-auto p-2">
    <ul class="space-y-1">
      {#each sessions as session}
        <li>
          <button
            type="button"
            onclick={() => selectSession(session.id)}
            class="w-full text-left px-3 py-2 rounded-lg transition-colors {selectedId === session.id
              ? 'bg-redis-hyper/10 text-redis-hyper border border-redis-hyper/30'
              : 'hover:bg-redis-black-10 dark:hover:bg-redis-dusk text-redis-black dark:text-redis-white'}"
          >
            <div class="font-semibold text-sm truncate">{session.name}</div>
            <div class="text-xs opacity-60 mt-1">{session.lastActive}</div>
          </button>
        </li>
      {/each}
    </ul>
  </div>
</aside>
