export const config = {
  // OpenAI configuration
  // - Local dev: Direct OpenAI API with OPENAI_API_KEY
  // - Azure deployment: LiteLLM proxy with OPENAI_BASE_URL pointing to LiteLLM
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_BASE_URL,
  openaiModel: 'gpt-4o-mini',
  openaiTemperature: 0.7,

  // AMS
  amsBaseUrl: process.env.AMS_BASE_URL ?? 'http://localhost:8000',
  amsContextWindowMax: process.env.AMS_CONTEXT_WINDOW_MAX ? parseInt(process.env.AMS_CONTEXT_WINDOW_MAX) : 4000,

  // Redis
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379'
}
