<script lang="ts">
  import SessionViewModel from './session-view-model.svelte'
  import SessionItem from './SessionItem.svelte'

  const viewModel = SessionViewModel.instance
</script>

<ul class="flex-1 overflow-y-auto p-2 space-y-1">
  {#if !viewModel.hasSessions}
    <li class="text-center text-redis-black-50 dark:text-redis-dusk-50 text-md list-none">No sessions yet</li>
  {:else}
    {#each viewModel.sessions as session}
      <SessionItem id={session.id} lastActive={session.lastActive} />
    {/each}
  {/if}
</ul>
