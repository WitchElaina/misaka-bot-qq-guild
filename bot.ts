import { OpenAPI, WebsocketClient, createOpenAPI, createWebsocket } from '@misaka-bot/sdk';
import { MisakaPlugin } from './plugin';

export interface MisakaBotConfig {
  appID: string;
  token: string;
  sandbox: boolean;
  plugins: MisakaPlugin[];
}

export class MisakaBot {
  client: OpenAPI;
  ws: WebsocketClient;
  plugins: MisakaPlugin[];
  constructor(config: MisakaBotConfig) {
    this.client = createOpenAPI({
      appID: config.appID,
      token: config.token,
      sandbox: config.sandbox,
    });
    this.ws = createWebsocket({
      appID: config.appID,
      token: config.token,
      sandbox: config.sandbox,
      intents: [],
    });
    //
    this.plugins = config.plugins;
    this.plugins.forEach((plugin) => {
      plugin.load(this.client, this.ws);
    });
  }
}
