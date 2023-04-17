import { log } from "@usekits/cli";
import { AxiosRequestConfig } from "axios";
import { Configuration, OpenAIApi } from "openai";
var { SocksProxyAgent } = require('socks-proxy-agent');


import { Provider, Text } from "..";
const proxy = process.env.socks_proxy || 'socks://127.0.0.1:1081';
const vmessServer = {
  host: 'your.vmess.server.ip',
  port: 1234,
  uuid: 'your-vmess-uuid',
  alterId: 32,
  cipher: 'auto'
};

const configuration = new Configuration({
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

var agent = new SocksProxyAgent(proxy);
const axiosConfig = {
  httpsAgent: agent,
  httpAgent: agent
  // proxy: {
  //   host: 'localhost',
  //   port: 8001,
  // }
}

class OpenAI implements Provider {
  async chat(text: string): Promise<Text> {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }, axiosConfig);
      return {
        content: completion.data.choices[0].message.content
      };
    } catch (error) {
      log.error(error)
    }

  };
}

export default OpenAI;