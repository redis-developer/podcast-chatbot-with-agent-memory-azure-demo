<script lang="ts">
  import ContextViewModel from '@components/context/context-view-model.svelte'
  import ContextSummary from './ContextSummary.svelte'
  import ContextMessages from './ContextMessages.svelte'
  import InfoCard from '@components/InfoCard.svelte'

  const viewModel = ContextViewModel.instance
</script>

<div class="flex-1 flex flex-col min-h-0 p-5 overflow-y-auto">
  <h2 class="text-xl font-bold mb-4 text-redis-black dark:text-redis-white">
    <i class="fa-solid fa-note-sticky mr-2"></i>
    Working Memory
  </h2>

  <p class="text-sm text-redis-black-50 dark:text-redis-dusk-50 mb-6">
    This is the current working memory that Agent Memory Server maintains. It includes a compacted summary of older
    messages and recent conversation history.
  </p>

  {#if viewModel.hasSummary || viewModel.hasMessages}
    <ContextSummary />
    <ContextMessages />
  {:else}
    <InfoCard
      clazz="flex items-center justify-center"
      icon="fa-solid fa-note-sticky"
      description="No context yet. Start a conversation and your session context will appear here."
    />
  {/if}
</div>
