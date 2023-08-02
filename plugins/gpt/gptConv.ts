import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { config } from 'dotenv';

config();
// console.log(process.env.OPENAI_ORG_ID, process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const newChat = async (messages: ChatCompletionRequestMessage[]) => {
  return await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })
    .then((res) => {
      return res.data.choices[0].message?.content || 'No response';
    })
    .catch((err) => {
      console.log(err.data);
      throw err;
    });
};

class GPTContinuousChat {
  curMessages: ChatCompletionRequestMessage[];
  tokenUsed: number;
  constructor() {
    this.curMessages = [];
    this.tokenUsed = 0;
  }
  newChat = async (content: string) => {
    this.curMessages.push({
      role: 'user',
      content,
    });
    return await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: this.curMessages,
      })
      .then((res) => {
        this.curMessages.push({
          role: 'assistant',
          content: res.data.choices[0].message?.content,
        });
        this.tokenUsed = res.data.usage?.total_tokens || 0;
        return res.data.choices[0].message?.content || 'No response';
      })
      .catch((err) => {
        console.log(err.data);
        this.clearChat();
        return 'Error' + err?.data?.detail;
      });
  };
  clearChat = () => {
    this.curMessages = [];
    this.tokenUsed = 0;
  };
  getInfo = () => {
    return `Tokens used: ${this.tokenUsed}\nTotal messages: ${this.curMessages.length}`;
  };
}
export { newChat, GPTContinuousChat };
