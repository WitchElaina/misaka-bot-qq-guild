import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { createLanguageModel, createJsonTranslator, processRequests } from 'typechat';
import { SentimentResponse } from './sentimentSchema';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';

config();

const model = createLanguageModel(process.env);
const schema = fs.readFileSync('./plugins/sentiment/sentimentSchema.ts', 'utf8');
const translator = createJsonTranslator<SentimentResponse>(model, schema, 'SentimentResponse');

const judgeSentiment = async (text: string) => {
  const response = await translator.translate(text);
  if (!response.success) {
    console.log(response.message);
    return;
  }
  console.log(`The sentiment is ${response.data.sentiment}`);
  return response.data.sentiment;
};

const load = (client: OpenAPI, ws: WebsocketClient, channel: string) => {
  ws.on('GUILD_MESSAGES', async (data) => {
    if (data.msg.channel_id !== channel || !data.msg?.content?.startsWith('smt ')) return;
    const sentimentRes = await judgeSentiment(data.msg.content.slice(4)).then((res) => {
      console.log('smt: ', data.msg.content.slice(4), res);
      return res;
    });
    await client.messageApi.postMessage(data.msg.channel_id, {
      content: sentimentRes !== undefined ? sentimentRes : 'Error',
    });
  });
};

export default { load };
