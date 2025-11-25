<script lang="ts">
  import ContextViewModel from '@components/context/context-view-model.svelte'
  import SessionPanel from '@components/session/SessionPanel.svelte'
  import ContextPanel from '@components/context/ContextPanel.svelte'

  const viewModel = ContextViewModel.instance

  $effect(() => {
    viewModel.loadContext()
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionPanel />
  <ContextPanel />
</div>
