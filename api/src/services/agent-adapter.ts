import dedent from 'dedent'
import { SystemMessage, BaseMessage, AIMessage } from '@langchain/core/messages'
import { ChatOpenAI, AzureChatOpenAI } from '@langchain/openai'

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
  switch (config.nodeEnv) {
    case 'prod':
    case 'stage':
      return createAzureLLM()
    case 'dev':
      return createLocalLLM()
    default:
      throw new Error(`Unsupported NODE_ENV: ${config.nodeEnv}`)
  }
}

function createLocalLLM(): ChatOpenAI {
  return new ChatOpenAI({
    apiKey: config.openaiApiKey,
    model: 'gpt-4o-mini',
    temperature: 0.7
  })
}

function createAzureLLM(): ChatOpenAI {
  return new AzureChatOpenAI({
    azureOpenAIApiKey: config.azureOpenAIApiKey,
    azureOpenAIEndpoint: config.azureOpenAIEndpoint,
    azureOpenAIApiDeploymentName: config.azureOpenAIDeployment,
    azureOpenAIApiVersion: config.azureOpenAIApiVersion,
    temperature: 0.7
  })
}
