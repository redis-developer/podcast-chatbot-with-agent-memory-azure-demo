<script lang="ts">
  import { marked } from 'marked'
  import LoadingOverlay from '@components/LoadingOverlay.svelte'

  type ChatMessage = {
    role: 'user' | 'podbot' | 'summary'
    content: string
  }

  interface Props {
    messages: ChatMessage[]
    isLoading: boolean
  }

  let { messages, isLoading }: Props = $props()
  let messagesContainer: HTMLDivElement

  // Auto-scroll to bottom when new messages arrive
  $effect(() => {
    if (messages.length > 0 && messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  })

  function renderMarkdown(content: string): string {
    return marked.parse(content, { async: false }) as string
  }

  function getUsernameColor(role: ChatMessage['role']): string {
    if (role === 'user') return 'text-redis-sky-blue'
    if (role === 'podbot') return 'text-redis-hyper dark:text-redis-yellow'
    return 'text-redis-black-50 dark:text-redis-violet'
  }

  function getUsername(role: ChatMessage['role']): string {
    if (role === 'user') return 'you'
    if (role === 'podbot') return 'podbot'
    return 'summary'
  }
</script>

<div
  bind:this={messagesContainer}
  class="flex-1 overflow-y-auto p-5 md:p-4 font-mono leading-relaxed min-h-0 relative"
>
  {#if messages.length === 0}
    <div class="flex items-center justify-center h-full">
      <div class="text-center p-8 bg-redis-violet-20 dark:bg-redis-dusk rounded-lg border-l-4 border-redis-violet">
        <i class="fa-solid fa-comments text-5xl text-redis-violet mb-4"></i>
        <p class="text-lg font-sans italic text-redis-black dark:text-redis-white">
          Start a conversation! Ask PodBot for podcast recommendations.
        </p>
      </div>
    </div>
  {:else}
    <ul class="list-none p-1 m-0">
      {#each messages as message}
        {#if message.role === 'summary'}
          <li class="text-redis-black-50 dark:text-redis-violet italic mb-4 font-sans p-3 bg-redis-violet-20 dark:bg-redis-dusk rounded-lg border-l-4 border-redis-violet">
            {@html renderMarkdown(message.content)}
          </li>
        {:else}
          <li class="mb-1.5 py-2 list-none">
            <span class="font-bold {getUsernameColor(message.role)}">
              {getUsername(message.role)}:
            </span>
            {#if message.role === 'podbot'}
              <span class="bot-message">
                {@html renderMarkdown(message.content)}
              </span>
            {:else}
              {message.content}
            {/if}
          </li>
        {/if}
      {/each}
    </ul>
  {/if}

  {#if isLoading}
    <LoadingOverlay />
  {/if}
</div>
