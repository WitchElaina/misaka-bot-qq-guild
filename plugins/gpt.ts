import { newChat } from './gptConv';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';

const load = (client: OpenAPI, ws: WebsocketClient, channel: string) => {
  ws.on('GUILD_MESSAGES', async (data) => {
    if (data.msg.channel_id !== channel) return;
    const content = await newChat([data.msg.content]);
    await client.messageApi.postMessage(data.msg.channel_id, { content: String(content) });
  });
};

export default { load };
