import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const newChat = async (messages: ChatCompletionRequestMessage[]) => {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  });
  return response.data;
};

export default class GptConversation {
  messages: ChatCompletionRequestMessage[];
  constructor() {
    this.messages = [];
  }

  async addMessage(message: ChatCompletionRequestMessage) {
    this.messages.push(message);
    await newChat(this.messages).then((res) => {});
  }

  async getMessages() {
    return this.messages;
  }

  async reset() {
    this.messages = [];
  }
}

const conversation = new GptConversation();
