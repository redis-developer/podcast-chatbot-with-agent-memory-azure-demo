<script lang="ts">
  import ChatViewModel from './chat-view-model.svelte'

  const viewModel = ChatViewModel.instance

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      viewModel.sendMessage()
    }
  }
</script>

<div class="flex gap-3 items-center p-5 md:px-4 shrink-0">
  <input
    class="flex-1 bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-mono text-sm rounded-lg focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
    type="text"
    bind:value={viewModel.currentMessage}
    onkeydown={handleKeydown}
    placeholder="Ask PodBot anything about podcasts..."
  />
  <button
    type="button"
    onclick={viewModel.sendMessage}
    disabled={!viewModel.hasCurrentMessage}
    class="bg-redis-hyper hover:bg-redis-deep-hyper border-2 border-redis-hyper hover:border-redis-deep-hyper text-white px-4 py-3 font-sans text-sm font-semibold cursor-pointer rounded-lg transition-all flex items-center gap-2 min-w-20 justify-center focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed md:min-w-12 md:px-3"
  >
    <i class="fa-solid fa-paper-plane text-base md:text-lg"></i>
    <span class="md:hidden">Send</span>
  </button>
</div>
