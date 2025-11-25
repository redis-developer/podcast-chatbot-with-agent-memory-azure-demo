import type { ChatMessage } from '@state/chat-state.svelte'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadMessages(sessionId: string, username: string): Promise<ChatMessage[]> {
  await delay(500)

  return [
    { role: 'user', content: 'Can you recommend some history podcasts?' },
    {
      role: 'podbot',
      content:
        "I would recommend **Hardcore History** by Dan Carlin. It's an excellent deep dive into various historical topics."
    },
    { role: 'user', content: 'What about something shorter?' },
    {
      role: 'podbot',
      content: 'For shorter episodes, try **History in 10 Minutes** or **Stuff You Missed in History Class**.'
    }
  ]
}

export async function sendMessage(sessionId: string, username: string, content: string): Promise<string> {
  await delay(1000)

  return `Thanks for your message: "${content}". This is a stubbed response.`
}
