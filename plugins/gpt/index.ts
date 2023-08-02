import { newChat, GPTContinuousChat } from './gptConv';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';
import { GPTConfiguration } from './config';
import { sendTextMsg } from '../../utils/message';

const load = (client: OpenAPI, ws: WebsocketClient, channel: string) => {
  ws.on('GUILD_MESSAGES', async (data) => {
    if (data.msg.channel_id !== channel || !data.msg?.content?.startsWith('gpt ')) return;
    if (data.msg.content.split(' ')[1] === 'Mszook是不是小熊猫饲养员') {
      client.messageApi.postMessage(data.msg.channel_id, {
        content: '是的，Mszook是小熊猫饲养员',
      });
      return;
    }
    console.log('start: ', data.msg.content);
    await sendTextMsg(client, data.msg.channel_id, 'misaka bot thinking...');
    await newChat([
      {
        role: 'user',
        content: data.msg.content.split(' ')[1],
      },
    ]).then((res) => {
      sendTextMsg(client, data.msg.channel_id, res);
    });
  });
};

const loadContinuous = (client: OpenAPI, ws: WebsocketClient, channel: string) => {
  const gpt = new GPTContinuousChat();
  ws.on('GUILD_MESSAGES', async (data) => {
    if (data.msg.channel_id !== channel || !data.msg?.content?.startsWith('gpt ')) return;
    const content = data.msg.content.slice(4);
    if (content === 'clear') {
      gpt.clearChat();
      await sendTextMsg(client, data.msg.channel_id, 'Chat cleared.');
    } else if (content === 'help') {
      await sendTextMsg(
        client,
        data.msg.channel_id,
        'Commands:\nclear: clear chat\ninfo: get info',
      );
    } else if (content === 'info') {
      await sendTextMsg(client, data.msg.channel_id, gpt.getInfo());
    } else {
      await sendTextMsg(client, data.msg.channel_id, 'MisakaBot thinking...');
      await gpt.newChat(content).then((res) => {
        sendTextMsg(client, data.msg.channel_id, res);
      });
    }
  });
};

export default { load, loadContinuous };
