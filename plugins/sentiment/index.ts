import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { createLanguageModel, createJsonTranslator, processRequests } from 'typechat';
import { SentimentResponse } from './sentimentSchema';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';
import { MisakaPlugin, MisakaPluginConfig } from '../../plugin';
import { sendTextMsg } from '../../utils/message';

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

class Sentiment extends MisakaPlugin {
  constructor(config: MisakaPluginConfig) {
    super(config);
    this.addEvent(['DEFAULT_COMMAND'], async (data: any) => {
      const sentimentRes = await judgeSentiment(data.msg.content.slice(4)).then((res) => {
        return res;
      });
      await sendTextMsg(
        this.client,
        data.msg.channel_id,
        sentimentRes !== undefined ? sentimentRes : 'Error',
      );
    });
  }
}

export default Sentiment;
