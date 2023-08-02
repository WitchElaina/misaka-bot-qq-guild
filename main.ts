import { MisakaBot } from './bot';

import Hitokoto from './plugins/hitokoto';
import GPTContinuousChat from './plugins/gpt';
import Sentiment from './plugins/sentiment';
import Words from './plugins/words';

import { config } from 'dotenv';
config();

const hitokoto = new Hitokoto({
  prompt: '一言',
});

const gpt = new GPTContinuousChat({
  prompt: 'gpt',
});

const sentiment = new Sentiment({
  prompt: 'smt',
});

const words = new Words({
  prompt: 'words',
});

const bot = new MisakaBot({
  appID: process.env.APP_ID as string,
  token: process.env.TOKEN as string,
  sandbox: false,
  plugins: [hitokoto, gpt, sentiment, words],
});
