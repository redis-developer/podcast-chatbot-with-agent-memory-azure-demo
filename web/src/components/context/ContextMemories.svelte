<script lang="ts">
  import ContextViewModel from '@components/context/context-view-model.svelte'
  import ContextMemory from './ContextMemory.svelte'

  const viewModel = ContextViewModel.instance
</script>

{#if viewModel.hasRelevantMemories}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2 mt-6">
    Relevant Memories ({viewModel.relevantMemoriesCount})
  </h3>
  <ul class="space-y-3">
    {#each viewModel.relevantMemories as memory}
      <ContextMemory content={memory.content} createdAt={memory.createdAt} topics={memory.topics} />
    {/each}
  </ul>
{/if}
