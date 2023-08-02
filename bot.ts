import { OpenAPI, WebsocketClient, createOpenAPI, createWebsocket } from '@misaka-bot/sdk';
import { MisakaPlugin, MisakaPluginEvent } from './plugin';

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
    this.plugins = config.plugins;
    this.plugins.forEach((plugin) => {
      this.load(plugin);
    });
  }

  load(plugin: MisakaPlugin) {
    plugin.plug(this.client, this.ws);
    this.ws.on('GUILD_MESSAGES', (data) => {
      if (data.msg?.content.startsWith(plugin.prompt + ' ')) {
        data.msg.content = data.msg.content.slice((plugin.prompt + ' ').length);
        const cmd = data.msg.content.split(' ')[0];
        if (plugin.eventNames().includes(cmd)) {
          plugin.emit(cmd, data);
        } else {
          console.log(`[${plugin.prompt}]emit: DEFAULT_COMMAND`);
          plugin.emit('DEFAULT_COMMAND', data);
        }
      }
      if (data.msg?.content === plugin.prompt) {
        console.log(`[${plugin.prompt}]emit: DEFAULT_COMMAND`);
        plugin.emit('DEFAULT_COMMAND', data);
      }
    });
  }
}
