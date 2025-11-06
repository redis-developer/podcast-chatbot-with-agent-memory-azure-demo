export const config = {
  port: process.env.PORT ?? 3001,
  nodeEnv: process.env.NODE_ENV ?? 'dev',

  // OpenAI configuration
  // - Local dev: Direct OpenAI API with OPENAI_API_KEY
  // - Azure deployment: LiteLLM proxy with OPENAI_BASE_URL pointing to LiteLLM
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_BASE_URL,  // Optional: LiteLLM proxy URL or custom endpoint

  // AMS
  amsBaseUrl: process.env.AMS_BASE_URL ?? 'http://localhost:8000',
  amsContextWindowMax: process.env.AMS_CONTEXT_WINDOW_MAX ? parseInt(process.env.AMS_CONTEXT_WINDOW_MAX) : 4000
}
