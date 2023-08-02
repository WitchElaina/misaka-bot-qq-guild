import { OpenAPI } from '@misaka-bot/sdk';

const sendTextMsg = async (client: OpenAPI, channel: string, content: string) => {
  console.log('Send text msg: ', content);
  await client.messageApi
    .postMessage(channel, {
      content,
    })
    .catch((err) => {
      console.log('[Error] send text msg.', err);
      throw err;
    });
};

export { sendTextMsg };
