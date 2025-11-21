<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'

  // Stubbed long-term memory data for UI development
  const memories = [
    {
      id: '1',
      content: "Prefers history podcasts, especially ancient Rome and World War II",
      created: "Nov 15, 2024"
    },
    {
      id: '2',
      content: "Likes episodes under 45 minutes",
      created: "Nov 15, 2024"
    },
    {
      id: '3',
      content: "Enjoys narrative storytelling style over interview format",
      created: "Nov 16, 2024"
    },
    {
      id: '4',
      content: "Has listened to and enjoyed Dan Carlin's Hardcore History",
      created: "Nov 17, 2024"
    },
    {
      id: '5',
      content: "Completed The History of Rome podcast by Mike Duncan",
      created: "Nov 18, 2024"
    }
  ]
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <div class="flex-1 flex flex-col min-h-0 p-5 overflow-y-auto">
    <h2 class="text-xl font-bold mb-4 text-redis-black dark:text-redis-white">
      <i class="fa-solid fa-database text-redis-hyper mr-2"></i>
      Long-term Memory
    </h2>

  <p class="text-sm text-redis-black-50 dark:text-redis-dusk-50 mb-6">
    These are facts and preferences AMS has extracted from your conversations and stored for future reference.
  </p>

  {#if memories.length === 0}
    <div class="flex-1 flex items-center justify-center">
      <div class="text-center p-8 bg-redis-violet-20 dark:bg-redis-dusk rounded-lg border-l-4 border-redis-violet">
        <i class="fa-solid fa-database text-5xl text-redis-violet mb-4"></i>
        <p class="text-lg font-sans text-redis-black dark:text-redis-white">
          No long-term memories yet.
        </p>
        <p class="text-sm text-redis-black-50 dark:text-redis-dusk-50 mt-2">
          Keep chatting and PodBot will remember important details about your preferences.
        </p>
      </div>
    </div>
  {:else}
    <ul class="space-y-3">
      {#each memories as memory}
        <li class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-4 flex items-start gap-3">
          <i class="fa-solid fa-lightbulb text-redis-yellow mt-1"></i>
          <div class="flex-1">
            <p class="text-sm text-redis-black dark:text-redis-white">
              {memory.content}
            </p>
            <p class="text-xs text-redis-black-50 dark:text-redis-dusk-50 mt-2">
              Learned: {memory.created}
            </p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
  </div>
</div>
