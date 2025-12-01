<script lang="ts">
  import MemoryViewModel from '@components/memory/memory-view-model.svelte'
  import MemoryItem from './MemoryItem.svelte'

  const viewModel = MemoryViewModel.instance
</script>

{#if viewModel.hasMemories}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Memories ({viewModel.memoryCount})
  </h3>
  <ul class="space-y-3">
    {#each viewModel.memories as memory}
      <MemoryItem id={memory.id} content={memory.content} createdAt={memory.createdAt} topics={memory.topics} />
    {/each}
  </ul>
{/if}
