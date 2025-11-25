<script lang="ts">
  import ContextViewModel from '@components/context/context-view-model.svelte'

  const viewModel = ContextViewModel.instance
</script>

{#if viewModel.hasSummary}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Compacted Context
  </h3>
  <p
    class="text-sm text-redis-black dark:text-redis-white leading-relaxed font-mono bg-redis-white dark:bg-redis-black-90 border border-redis-black-10 dark:border-redis-dusk-70 rounded-lg p-4 mb-6"
  >
    {viewModel.summary}
  </p>
{/if}
