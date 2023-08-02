import axios from 'axios';
import { config } from 'dotenv';
import { OpenAPI, WebsocketClient } from '@misaka-bot/sdk';
import { sendTextMsg } from '../../utils/message';
import { MisakaPlugin, MisakaPluginConfig } from '../../plugin';

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

const getHitokotoTypeMap = () => {
  let ret = '';
  for (const key in hitokotoTypeMap) {
    if (key === 'toString') continue;
    ret += `${key} ${hitokotoTypeMap[key]}\n`;
  }
  return ret;
};

class Hitokoto extends MisakaPlugin {
  constructor(config: MisakaPluginConfig) {
    super(config);
    this.addHitokotoEvents();
  }

  getHitokoto = async (type_: string = 'a') => {
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

  sendHitokoto = async (channelID: string, client: OpenAPI, type_: string = 'a') => {
    const hitokoto = await this.getHitokoto(type_);
    await sendTextMsg(client, channelID, hitokoto);
  };

  addHitokotoEvents = () => {
    const keys = Object.keys(hitokotoTypeMap);
    const values = Object.values(hitokotoTypeMap);
    keys.forEach((key) => {
      this.addEvent([key], async (data: any) => {
        await this.sendHitokoto(data.msg.channel_id, this.client, hitokotoTypeMap[key]);
      });
    });

    values.forEach((value) => {
      this.addEvent([value], async (data: any) => {
        await this.sendHitokoto(data.msg.channel_id, this.client, value);
      });
    });

    this.addEvent(['help', '帮助'], async (data: any) => {
      await sendTextMsg(this.client, data.msg.channel_id, getHitokotoTypeMap());
    });

    this.addEvent(['DEFAULT_COMMAND'], async (data: any) => {
      await this.sendHitokoto(data.msg.channel_id, this.client);
    });
  };
}

export default Hitokoto;
