<script lang="ts">
  import SessionViewModel from './session-view-model.svelte'
  import SessionList from './SessionList.svelte'

  const viewModel = SessionViewModel.instance
</script>

<aside
  class="w-64 bg-redis-white dark:bg-redis-black border-r border-redis-black-10 dark:border-redis-dusk-70 flex flex-col shrink-0"
>
  <button
    type="button"
    onclick={viewModel.createSession}
    class="m-4 bg-redis-hyper hover:bg-redis-deep-hyper text-white px-4 py-2 font-sans text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
  >
    <i class="fa-solid fa-plus"></i>
    <span>New Session</span>
  </button>

  <SessionList />
</aside>
