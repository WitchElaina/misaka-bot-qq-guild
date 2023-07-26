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
  let response;
  await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })
    .then((res) => {
      console.log(res.data);
      response = res.data.choices[0];
    })
    .catch((err) => {
      console.log(err.data);
      throw err;
    });
  return response;
};

export { newChat };
