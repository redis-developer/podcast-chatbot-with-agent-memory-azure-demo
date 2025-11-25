<script lang="ts">
  import MemoryViewModel from '@components/memory/memory-view-model.svelte'
  import MemoryList from './MemoryList.svelte'
  import InfoCard from '@components/InfoCard.svelte'

  const viewModel = MemoryViewModel.instance
</script>

<div class="flex-1 flex flex-col min-h-0 p-5 overflow-y-auto">
  <h2 class="text-xl font-bold mb-4 text-redis-black dark:text-redis-white">
    <i class="fa-solid fa-brain mr-2"></i>
    Long-term Memory
  </h2>

  <p class="text-sm text-redis-black-50 dark:text-redis-dusk-50 mb-6">
    These are facts and preferences that Agent Memory Server has extracted from your conversations and stored for future
    reference.
  </p>

  {#if viewModel.hasMemories}
    <MemoryList />
  {:else}
    <InfoCard
      clazz="flex items-center justify-center"
      icon="fa-solid fa-brain"
      description="No memories yet. Keep chatting and PodBot will remember important details about your preferences."
    />
  {/if}
</div>
