import { WebsocketClient, OpenAPI } from '@misaka-bot/sdk';
import EventEmitter from 'events';

export interface MisakaPluginConfig {
  prompt: string;
  blockChannels: string[];
}

export class MisakaPlugin extends EventEmitter {
  prompt: string;
  client: OpenAPI | null;
  ws: WebsocketClient | null;
  constructor(config: MisakaPluginConfig) {
    super();
    this.prompt = config.prompt;
    this.client = null;
    this.ws = null;
  }
  load(client: OpenAPI, ws: WebsocketClient) {
    this.client = client;
    this.ws = ws;
  }
}
