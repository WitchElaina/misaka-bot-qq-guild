import { OpenAPI } from '@misaka-bot/sdk';

const getGuilds = async (client: OpenAPI) => {
  await client.meApi
    .meGuilds()
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getGuildIdbyName = async (client: OpenAPI, name: string) => {};

const getChannelIdbyName = async (name: string, guildId: string, client: OpenAPI) => {
  let ret = '';
  await client.channelApi
    .channels(guildId)
    .then((res) => {
      if (res.data.length === 0) throw new Error('No channels found');
      for (const channel of res.data) {
        // console.log(channel.name);
        if (channel.name === name) {
          // console.log(channel.id);
          ret = channel.id;
        }
      }
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return ret;
};

export { getGuilds, getGuildIdbyName, getChannelIdbyName };
