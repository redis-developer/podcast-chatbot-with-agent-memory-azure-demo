import dedent from 'dedent'
import { SystemMessage, BaseMessage, AIMessage } from '@langchain/core/messages'
import { ChatOpenAI } from '@langchain/openai'

import { config } from '@/config.js'

const SYSTEM_PROMPT = dedent`
  You are PodBot, an enthusiastic podcast expert and recommendation engine.
  You ONLY discuss podcasts - shows, hosts, episodes, formats, platforms, and the
  podcasting industry.

  You have extensive knowledge of podcasts across all genres and formats,
  from popular mainstream shows to niche indie productions. You're also
  well-versed in podcast platforms, apps, and the broader podcasting industry.

  Always stay on topic - if someone asks about anything other than podcasts,
  politely redirect them back to podcast discussions. Remember their preferences
  and past recommendations across our conversations.

  Be enthusiastic, knowledgeable, and ready to make personalized recommendations
  based on what they've enjoyed before.
`

const llm = createLLM()

export async function generateResponse(messages: BaseMessage[]): Promise<AIMessage> {
  // a basic system prompt
  const systemPrompt = new SystemMessage(SYSTEM_PROMPT)

  // call the LLM
  const response = await llm.invoke([systemPrompt, ...messages])

  // return the AI message
  return new AIMessage(response.text)
}

function createLLM(): ChatOpenAI {
  // In production/stage, we use LiteLLM proxy which translates to Azure OpenAI
  // In dev, we use either LiteLLM proxy (if available) or direct OpenAI
  // LiteLLM provides OpenAI-compatible API, so we always use ChatOpenAI class

  const configuration: any = {
    apiKey: config.openaiApiKey,
    model: 'gpt-4o-mini',
    temperature: 0.7
  }

  // If using LiteLLM proxy (Azure deployment) or custom base URL
  if (config.openaiBaseUrl) configuration.configuration = { baseURL: config.openaiBaseUrl }

  return new ChatOpenAI(configuration)
}
