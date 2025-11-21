<script lang="ts">
  interface Props {
    onSend: (message: string) => void
    isLoading: boolean
  }

  let { onSend, isLoading }: Props = $props()
  let messageInput = $state('')

  function handleSend() {
    if (!messageInput.trim() || isLoading) return

    const message = messageInput.trim()
    messageInput = ''
    onSend(message)
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }
</script>

<div class="bg-redis-white dark:bg-redis-black border-t border-redis-black-10 dark:border-redis-dusk-70 p-5 md:px-4 shrink-0">
  <div class="flex gap-3 items-center">
    <span class="text-redis-hyper font-bold font-mono text-lg">&gt;</span>
    <input
      type="text"
      bind:value={messageInput}
      onkeydown={handleKeydown}
      placeholder="Ask PodBot anything about podcasts..."
      disabled={isLoading}
      class="flex-1 bg-redis-light-gray dark:bg-redis-black-90 border-2 border-redis-black-10 dark:border-redis-dusk-70 text-redis-black dark:text-redis-white px-4 py-3 font-mono text-sm rounded-lg focus:outline-none focus:border-redis-hyper disabled:opacity-60 disabled:cursor-not-allowed"
    />
    <button
      type="button"
      onclick={handleSend}
      disabled={isLoading || !messageInput.trim()}
      class="bg-redis-hyper hover:bg-redis-deep-hyper border-2 border-redis-hyper hover:border-redis-deep-hyper text-white px-4 py-3 font-sans text-sm font-semibold cursor-pointer rounded-lg transition-all flex items-center gap-2 min-w-20 justify-center hover:-translate-y-px focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,68,56,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none md:min-w-12 md:px-3"
    >
      <i class="fa-solid fa-paper-plane text-base md:text-lg"></i>
      <span class="md:hidden">Send</span>
    </button>
  </div>
</div>
