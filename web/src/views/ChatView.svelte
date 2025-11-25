<script lang="ts">
  import ChatViewModel from '@components/chat/chat-view-model.svelte'
  import SessionPanel from '@components/session/SessionPanel.svelte'
  import ChatMessages from '@components/chat/ChatMessages.svelte'
  import ChatInput from '@components/chat/ChatInput.svelte'

  const viewModel = ChatViewModel.instance

  $effect(() => {
    viewModel.loadMessages()
  })
</script>

<div class="flex-1 flex min-h-0">
  <SessionPanel />
  <div class="flex-1 flex flex-col min-h-0">
    <ChatMessages />
    <ChatInput />
  </div>
</div>
