import { MisakaPlugin, MisakaPluginConfig } from '../../plugin';
import { sendTextMsg } from '../../utils/message';

import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { config } from 'dotenv';

config();
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

class GPTContinuousChat extends MisakaPlugin {
  curMessages: ChatCompletionRequestMessage[];
  tokenUsed: number;
  initial: string;
  constructor(config: MisakaPluginConfig) {
    super(config);
    this.curMessages = [];
    this.tokenUsed = 0;
    this.initial = '';
    this.loadEvents();
  }
  newChat = async (content: string) => {
    if (this.initial !== '' && this.curMessages.length === 0) {
      this.curMessages.push({
        role: 'system',
        content: this.initial,
      });
    }
    this.curMessages.push({
      role: 'user',
      content,
    });
    return await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: this.curMessages,
      })
      .then((res) => {
        this.curMessages.push({
          role: 'assistant',
          content: res.data.choices[0].message?.content,
        });
        this.tokenUsed = res.data.usage?.total_tokens || 0;
        return res.data.choices[0].message?.content || 'No response';
      })
      .catch((err) => {
        console.log(err.data);
        this.clearChat();
        return 'Error' + err?.data?.detail;
      });
  };
  clearChat = () => {
    this.curMessages = [];
    this.tokenUsed = 0;
  };
  reset = () => {
    this.clearChat();
    this.initial = '';
  };
  getInfo = () => {
    return `Tokens used: ${this.tokenUsed}\nTotal messages: ${this.curMessages.length}`;
  };
  loadEvents = () => {
    this.addEvent(['help', '帮助'], async (data: any) => {
      await sendTextMsg(
        this.client,
        data.msg.channel_id,
        'Commands:\nclear: clear chat\ninfo: get info',
      );
    });

    this.addEvent(['clear', '清除'], async (data: any) => {
      this.clearChat();
      await sendTextMsg(this.client, data.msg.channel_id, 'Chat cleared.');
    });

    this.addEvent(['info', '信息'], async (data: any) => {
      await sendTextMsg(this.client, data.msg.channel_id, this.getInfo());
    });

    this.addEvent(['reset', '重置'], async (data: any) => {
      this.reset();
      await sendTextMsg(this.client, data.msg.channel_id, 'Chat reset.');
    });

    this.addEvent(['init'], async (data: any) => {
      this.reset();
      this.initial = data.msg.content.slice(5);
      console.log(this.initial);
      await sendTextMsg(this.client, data.msg.channel_id, 'Initial message set.');
    });

    this.addEvent(['DEFAULT_COMMAND'], async (data: any) => {
      const content = data.msg.content;
      await sendTextMsg(this.client, data.msg.channel_id, 'MisakaBot thinking...');
      await this.newChat(content).then((res) => {
        sendTextMsg(this.client, data.msg.channel_id, res);
      });
    });
  };
}
export default GPTContinuousChat;
