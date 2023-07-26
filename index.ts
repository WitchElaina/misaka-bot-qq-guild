// ESModule | TypeScript
import {
  createOpenAPI,
  OpenAPI,
  createWebsocket,
  Config,
  GetWsParam,
  AvailableIntentsEventsEnum as INTENTS,
} from '@misaka-bot/sdk';

import hitokoto from './plugins/hitokoto';
import gpt from './plugins/gpt';
import pixiv from './plugins/pixiv';

import { getGuilds, getChannelIdbyName } from './utils/channel';

import { config } from 'dotenv';
// dotenv
config();

const clientConfig: Config = {
  appID: process.env.APP_ID as string,
  token: process.env.TOKEN as string,
  sandbox: false, // 是否使用沙箱环境
};

const client = createOpenAPI(clientConfig);

const wsConfig: GetWsParam = {
  appID: process.env.APP_ID as string,
  token: process.env.TOKEN as string,
  sandbox: false, // 是否使用沙箱环境
  intents: [INTENTS.GUILD_MESSAGES], // 需要订阅的事件
};

const ws = createWebsocket(wsConfig);
getChannelIdbyName('GPT', process.env.TEST_GUILD_ID as string, client).then((res) => {
  console.log(res);
  gpt.load(client, ws, res);
});

ws.on(INTENTS.GUILD_MESSAGES, (data) => {
  console.log(data?.msg?.author?.username + ': ' + data?.msg?.content);
  console.log(data?.msg?.author?.username + ': ' + data?.msg?.attachments[0]?.url);
  client.messageApi
    .postMessage(data?.msg?.channel_id, {
      image: 'https://' + String(data?.msg?.attachments[0]?.url),
    })
    .catch((err) => {
      console.log(err);
    });
});

hitokoto.load(client, ws);
pixiv.load();

export { client, ws };
