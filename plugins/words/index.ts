import { MisakaPlugin, MisakaPluginConfig } from '../../plugin';
import { sendTextMsg } from '../../utils/message';

import { config } from 'dotenv';
config();

import CET6 from './dicts/CET6_T.json';

const dicts = [CET6];

const randomDict = () => {
  const dict = dicts[Math.floor(Math.random() * dicts.length)];
  return dict;
};

const randomWord = () => {
  const dict = randomDict();
  const word = dict[Math.floor(Math.random() * dict.length)];
  return word;
};

class Words extends MisakaPlugin {
  constructor(config: MisakaPluginConfig) {
    super(config);
    this.addEvent(['DEFAULT_COMMAND'], async (data: any) => {
      const word = randomWord();
      await sendTextMsg(
        this.client,
        data.msg.channel_id,
        `${word.name}\n${word.trans}\nAmE[${word.usphone}]\nBrE[${word.ukphone}]`,
      );
    });
  }
}

export default Words;
