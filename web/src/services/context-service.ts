import type { Context } from '@state/context-state.svelte'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadContext(sessionId: string, username: string): Promise<Context> {
  await delay(500)

  return {
    context:
      "The user is interested in history podcasts, particularly ancient Rome and World War II. They prefer podcasts under 45 minutes and enjoy narrative storytelling styles. Previously recommended: Dan Carlin's Hardcore History, The History of Rome by Mike Duncan.",
    messages: [
      { role: 'user', content: 'What about something on the Byzantine Empire?' },
      {
        role: 'assistant',
        content:
          "For Byzantine history, I'd highly recommend 'The History of Byzantium' by Robin Pierson. It's a spiritual successor to Mike Duncan's 'The History of Rome' and picks up right where that series ends. Each episode is around 20-30 minutes, fitting your preference for shorter episodes."
      },
      { role: 'user', content: 'That sounds perfect! Any others?' },
      {
        role: 'assistant',
        content:
          "You might also enjoy '12 Byzantine Rulers' by Lars Brownworth - it's a classic that covers 12 pivotal emperors. It's shorter and more focused if you want a quick introduction before diving into the longer series."
      }
    ]
  }
}
