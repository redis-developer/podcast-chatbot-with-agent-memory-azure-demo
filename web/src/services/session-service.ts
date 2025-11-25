import { ulid } from 'ulid'

export type Session = {
  id: string
  lastActive: Date
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function loadSessions(username: string): Promise<Session[]> {
  // Simulate network delay
  await delay(500)

  // Stubbed sessions
  return [
    { id: ulid(), lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: ulid(), lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { id: ulid(), lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
  ]
}

export async function createSession(username: string): Promise<Session> {
  // Simulate network delay
  await delay(500)

  return {
    id: ulid(),
    lastActive: new Date()
  }
}
