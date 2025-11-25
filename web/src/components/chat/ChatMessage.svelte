<script lang="ts">
  import { marked } from 'marked'
  import ChatViewModel from './chat-view-model.svelte'

  const viewModel = ChatViewModel.instance

  type MessageRole = 'user' | 'podbot'

  interface Props {
    role: MessageRole
    content: string
  }

  let { role, content }: Props = $props()

  const username = $derived(role === 'user' ? (viewModel.username ?? 'user') : 'podbot')
  const usernameColor = $derived(role === 'user' ? 'text-redis-sky-blue' : 'text-redis-hyper dark:text-redis-yellow')
  const renderedContent = $derived(role === 'podbot' ? (marked.parse(content, { async: false }) as string) : content)
</script>

<li class="mb-2 list-none">
  <div class="font-bold {usernameColor}">
    {username}:
  </div>
  <div>
    {#if role === 'podbot'}
      {@html renderedContent}
    {:else}
      {renderedContent}
    {/if}
  </div>
</li>
