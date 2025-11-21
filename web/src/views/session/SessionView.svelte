<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'

  // Stubbed working memory data for UI development
  const workingMemory = {
    context: "The user is interested in history podcasts, particularly ancient Rome and World War II. They prefer podcasts under 45 minutes and enjoy narrative storytelling styles. Previously recommended: Dan Carlin's Hardcore History, The History of Rome by Mike Duncan.",
    messages: [
      { role: 'user', content: "What about something on the Byzantine Empire?" },
      { role: 'assistant', content: "For Byzantine history, I'd highly recommend 'The History of Byzantium' by Robin Pierson. It's a spiritual successor to Mike Duncan's 'The History of Rome' and picks up right where that series ends. Each episode is around 20-30 minutes, fitting your preference for shorter episodes." },
      { role: 'user', content: "That sounds perfect! Any others?" },
      { role: 'assistant', content: "You might also enjoy '12 Byzantine Rulers' by Lars Brownworth - it's a classic that covers 12 pivotal emperors. It's shorter and more focused if you want a quick introduction before diving into the longer series." }
    ]
  }
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <div class="flex-1 flex flex-col min-h-0 p-5 overflow-y-auto">
  <h2 class="text-xl font-bold mb-4 text-redis-black dark:text-redis-white">
    <i class="fa-solid fa-brain text-redis-hyper mr-2"></i>
    Working Memory (AMS Session)
  </h2>

  {#if workingMemory.context}
    <div class="mb-6">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
        Compacted Context
      </h3>
      <div class="bg-redis-violet-20 dark:bg-redis-dusk border-l-4 border-redis-violet rounded-lg p-4">
        <p class="text-sm text-redis-black dark:text-redis-white leading-relaxed font-mono">
          {workingMemory.context}
        </p>
      </div>
    </div>
  {/if}

  <div>
    <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
      Recent Messages ({workingMemory.messages.length})
    </h3>
    <ul class="space-y-3">
      {#each workingMemory.messages as message}
        <li class="bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-3">
          <div class="text-xs font-semibold uppercase mb-1 {message.role === 'user' ? 'text-redis-sky-blue' : 'text-redis-hyper dark:text-redis-yellow'}">
            {message.role}
          </div>
          <p class="text-sm text-redis-black dark:text-redis-white font-mono leading-relaxed">
            {message.content}
          </p>
        </li>
      {/each}
    </ul>
  </div>
  </div>
</div>
