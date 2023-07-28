import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { config } from 'dotenv';

config();
console.log(process.env.OPENAI_ORG_ID, process.env.OPENAI_API_KEY);
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

export { newChat };
