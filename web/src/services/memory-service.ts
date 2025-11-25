import type { Memory } from '@state/memory-state.svelte'

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadMemories(username: string): Promise<Memory[]> {
  await delay(500)

  return [
    {
      id: '1',
      content: 'Prefers history podcasts, especially ancient Rome and World War II',
      created: 'Nov 15, 2024'
    },
    {
      id: '2',
      content: 'Likes episodes under 45 minutes',
      created: 'Nov 15, 2024'
    },
    {
      id: '3',
      content: 'Enjoys narrative storytelling style over interview format',
      created: 'Nov 16, 2024'
    },
    {
      id: '4',
      content: "Has listened to and enjoyed Dan Carlin's Hardcore History",
      created: 'Nov 17, 2024'
    },
    {
      id: '5',
      content: 'Completed The History of Rome podcast by Mike Duncan',
      created: 'Nov 18, 2024'
    }
  ]
}
