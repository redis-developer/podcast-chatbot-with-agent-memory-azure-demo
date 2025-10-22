import 'dotenv/config';
export const config = {
    port: process.env.PORT ?? 3001,
    amsBaseUrl: process.env.AMS_BASE_URL ?? 'http://localhost:8000',
    amsContextWindowMax: process.env.AMS_CONTEXT_WINDOW_MAX ? parseInt(process.env.AMS_CONTEXT_WINDOW_MAX) : 4000,
    openaiApiKey: process.env.OPENAI_API_KEY
};
