import { WebsocketClient, OpenAPI } from '@misaka-bot/sdk';
import EventEmitter from 'events';

export enum MisakaPluginEvent {
  LOAD_ERROR = 'LOAD_ERROR',
  MESSAGE = 'MESSAGE',
}

export type MisaPluginEventHanler = (...args: any[]) => void;

export interface MisakaPluginConfig {
  prompt: string;
}

export class MisakaPlugin extends EventEmitter {
  prompt: string;
  client!: OpenAPI;
  ws!: WebsocketClient;
  events: Map<string, MisaPluginEventHanler>;
  load() {}

  constructor(config: MisakaPluginConfig) {
    super();
    this.prompt = config.prompt;
    this.events = new Map<string, MisaPluginEventHanler>();
  }
  plug(client: OpenAPI, ws: WebsocketClient) {
    this.client = client;
    this.ws = ws;
    this.load();
    this.messageHandler();
  }
  addEvent(events: string[], handler: MisaPluginEventHanler) {
    events.forEach((event) => {
      this.events.set(event, handler);
    });
  }
  messageHandler() {
    this.addEvent([MisakaPluginEvent.LOAD_ERROR], (err: Error) => {});
    for (const [event, handler] of this.events) {
      this.on(event, handler);
    }
  }
}
