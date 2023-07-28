import { OpenAIApi, Configuration } from 'openai';

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const availableModels = openai.listModels();
console.log('[GPT] available models:', availableModels);

export interface GPTConfiguration {
  model: keyof typeof availableModels;
  maxTokens: number;
  temperature: number;
}
