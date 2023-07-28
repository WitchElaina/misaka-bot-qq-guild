import { newChat } from './gptConv';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';
import { GPTConfiguration } from './config';

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
    await client.messageApi.postMessage(data.msg.channel_id, {
      content: 'misaka bot thinking...',
    });
    await newChat([
      {
        role: 'user',
        content: data.msg.content.split(' ')[1],
      },
    ])
      .then((res) => {
        console.log(res);
        client.messageApi
          .postMessage(data.msg.channel_id, {
            content: res,
          })
          .catch((err) => {
            console.log('sendmsg', err);
            throw err;
          });
      })
      .catch((err) => {
        console.log(err);
        return 'Error:' + err.message;
      });
  });
};

export default { load };
