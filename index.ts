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

ws.on(INTENTS.GUILD_MESSAGES, (data) => {
  console.log(data.msg.author.username + ': ' + data.msg.content);
});

hitokoto.load(client, ws);

export { client, ws };
