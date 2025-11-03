export const config = {
  port: process.env.PORT ?? 3001,
  nodeEnv: process.env.NODE_ENV ?? 'dev',

  // OpenAI (local development)
  openaiApiKey: process.env.OPENAI_API_KEY,

  // Azure OpenAI (production with API key)
  azureOpenAIEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  azureOpenAIDeployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,

  // AMS
  amsBaseUrl: process.env.AMS_BASE_URL ?? 'http://localhost:8000',
  amsContextWindowMax: process.env.AMS_CONTEXT_WINDOW_MAX ? parseInt(process.env.AMS_CONTEXT_WINDOW_MAX) : 4000
}
