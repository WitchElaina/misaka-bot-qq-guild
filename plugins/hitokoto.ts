import axios from 'axios';
import { config } from 'dotenv';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';

config();

const hitokotoTypeMap: {
  [key: string]: string;
} = {
  动画: 'a',
  漫画: 'b',
  游戏: 'c',
  文学: 'd',
  原创: 'e',
  来自网络: 'f',
  其他: 'g',
  影视: 'h',
  诗词: 'i',
  网易云: 'j',
  哲学: 'k',
  抖机灵: 'l',
};

hitokotoTypeMap.toString = () => {
  let ret = '';
  for (const key in hitokotoTypeMap) {
    if (key === 'toString') continue;
    ret += `${key} ${hitokotoTypeMap[key]}\n`;
  }
  return ret;
};

const getHitokoto = async (type_: string = 'a') => {
  let ret = '';
  await axios
    .get(process.env.HITOKOTO_API as string, {
      params: {
        c: String(type_),
      },
    })
    .then((res) => {
      const { hitokoto, from, from_who } = res.data;
      ret = `${hitokoto} —— ${from}${from_who ? ` ${from_who}` : ' '}`;
    })
    .catch((err) => {
      console.log(err, 'get err');
      ret = '一言获取失败';
    });
  console.log(ret);
  return ret;
};

const sendHitokoto = async (channelID: string, client: OpenAPI, type_: string = 'a') => {
  const hitokoto = await getHitokoto(type_);
  await client.messageApi
    .postMessage(channelID, {
      content: hitokoto,
    })
    .catch((err) => {
      console.log(err, 'send err');
    });
};

const load = (client: OpenAPI, ws: WebsocketClient) => {
  ws.on('GUILD_MESSAGES', async (data) => {
    if (data.msg.content.startsWith('一言 ')) {
      const hitokotoType = data.msg.content.split(' ')[1];
      const keys = Object.keys(hitokotoTypeMap);
      const values = Object.values(hitokotoTypeMap);
      if (hitokotoType) {
        if (keys.includes(hitokotoType)) {
          const index = keys.indexOf(hitokotoType);
          const type_ = values[index];
          await sendHitokoto(data.msg.channel_id, client, type_);
        } else if (values.includes(hitokotoType)) {
          await sendHitokoto(data.msg.channel_id, client, hitokotoType);
        } else if (hitokotoType === 'help' || hitokotoType === '帮助') {
          await client.messageApi
            .postMessage(data.msg.channel_id, {
              content: `一言帮助：\n${hitokotoTypeMap.toString()}`,
            })
            .catch((err) => {
              console.log(err, 'send err');
            });
        } else {
          await client.messageApi
            .postMessage(data.msg.channel_id, {
              content: '参数不合法',
            })
            .catch((err) => {
              console.log(err, 'send err');
            });
        }
      }
    } else if (data.msg.content === '一言') {
      await sendHitokoto(data.msg.channel_id, client);
    }
  });
};

export default { load };
