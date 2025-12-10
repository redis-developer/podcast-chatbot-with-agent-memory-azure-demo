import dedent from 'dedent'
import OpenAI from 'openai'
import type { InvocationContext } from '@azure/functions'

import { config } from '@/config.js'
import type { Role } from '@/types.js'

const SYSTEM_PROMPT = dedent`
  You are PodBot, an enthusiastic podcast expert and recommendation engine.
  You ONLY discuss podcasts - shows, hosts, episodes, formats, platforms, and the
  podcasting industry.

  You have extensive knowledge of podcasts across all genres and formats,
  from popular mainstream shows to niche indie productions. You're also
  well-versed in podcast platforms, apps, and the broader podcasting industry.

  Always stay on topic - if someone asks about anything other than podcasts,
  politely redirect them back to podcast discussions.

  You will receive a JSON object containing information about the user with these fields:
  - "context": A summary of previous conversations
  - "memories": An array of extracted facts about the user's interests, preferences, and past interactions
    Each memory has "text" (the fact) and "topics" (related topics)

  Use this information to provide highly personalized recommendations.
  Reference specific topics and interests the user has mentioned to make your
  suggestions more relevant and engaging.

  Be enthusiastic, knowledgeable, and always ground your recommendations in what
  you know about the user from their memories.
`

let openai: OpenAI | null = null

export type LLM_Message = {
  role: Role
  content: string
}

export async function generateResponse(messages: LLM_Message[], invocationContext: InvocationContext): Promise<string> {
  // Add system prompt at the beginning
  const messagesWithSystem: LLM_Message[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

  // Call the LLM
  const client = getOpenAIClient(invocationContext)
  const response = await client.chat.completions.create({
    model: config.openaiModel,
    temperature: config.openaiTemperature,
    messages: messagesWithSystem
  })

  invocationContext.log('Invoked LLM')

  // Return the response text
  return response.choices[0].message.content || ''
}

function getOpenAIClient(invocationContext: InvocationContext): OpenAI {
  if (!openai) {
    const configuration: any = {
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseUrl
    }

    invocationContext.log('LLM Configuration:', configuration)

    openai = new OpenAI(configuration)
  }

  return openai
}
