<script lang="ts">
  import MemoryViewModel from '@components/memory/memory-view-model.svelte'
  import SessionPanel from '@components/session/SessionPanel.svelte'
  import MemoryPanel from '@components/memory/MemoryPanel.svelte'

  const viewModel = MemoryViewModel.instance

  $effect(() => {
    viewModel.loadMemories()
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionPanel />
  <MemoryPanel />
</div>
