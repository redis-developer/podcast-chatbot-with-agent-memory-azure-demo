<script lang="ts">
  import SessionListPanel from '@components/SessionListPanel.svelte'
  import ChatPanel from './ChatPanel.svelte'
  import ChatInput from './ChatInput.svelte'

  // Stubbed data for UI development - will be replaced by view model
  type ChatMessage = {
    role: 'user' | 'podbot' | 'summary'
    content: string
  }

  let messages = $state<ChatMessage[]>([
    { role: 'user', content: "Can you recommend some history podcasts?" },
    { role: 'podbot', content: "I'd love to help you find great history podcasts! To give you the best recommendations, could you tell me:\n\n1. **What era or topic interests you most?** (Ancient history, World Wars, American history, etc.)\n2. **Do you prefer narrative storytelling or interview formats?**\n3. **How long do you like your episodes?** (Quick 20-min listens or deep 2-hour dives?)" },
    { role: 'user', content: "I love ancient Rome and prefer episodes under 45 minutes" },
    { role: 'podbot', content: "Perfect! For ancient Rome with shorter episodes, here are my top picks:\n\n**The History of Rome** by Mike Duncan - This is THE classic. 179 episodes covering Rome from founding to fall, averaging 20-25 minutes each.\n\n**Emperors of Rome** - Academic but accessible, with episodes around 30-40 minutes focusing on individual emperors.\n\n**Ancient Rome Refocused** - Great for specific topics and archaeological discoveries, usually under 30 minutes." }
  ])

  let isLoading = $state(false)

  async function handleSendMessage(message: string) {
    // Add user message immediately
    messages.push({ role: 'user', content: message })

    isLoading = true
    // TODO: Wire up to view model / API
    setTimeout(() => {
      messages.push({
        role: 'podbot',
        content: "Thanks for your message! This is a stubbed response while we build out the view models. Your message was: \"" + message + "\""
      })
      isLoading = false
    }, 1000)
  }
</script>

<div class="flex-1 flex min-h-0">
  <SessionListPanel />
  <div class="flex-1 flex flex-col min-h-0">
    <ChatPanel {messages} {isLoading} />
    <ChatInput onSend={handleSendMessage} {isLoading} />
  </div>
</div>
