<script lang="ts">
  import ContextViewModel from '@components/context/context-view-model.svelte'
  import ContextMessage from './ContextMessage.svelte'

  const viewModel = ContextViewModel.instance
</script>

{#if viewModel.hasMessages}
  <h3 class="text-sm font-semibold uppercase tracking-wide text-redis-black-50 dark:text-redis-dusk-50 mb-2">
    Recent Messages ({viewModel.messageCount})
  </h3>
  <ul class="space-y-3">
    {#each viewModel.messages as message}
      <ContextMessage role={message.role} content={message.content} />
    {/each}
  </ul>
{/if}
