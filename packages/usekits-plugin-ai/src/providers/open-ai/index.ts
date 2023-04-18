import { log } from "@usekits/cli";
import { AxiosRequestConfig } from "axios";
import { Configuration, OpenAIApi } from "openai";
var { SocksProxyAgent } = require('socks-proxy-agent');


import { Provider, Text } from "..";
const proxy = process.env.socks_proxy || 'socks://127.0.0.1:1081';

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
        model: "gpt-3.5-turbo-0301",
        // model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }, axiosConfig);
      if (completion?.data?.choices?.length > 0) {
        return {
          content: completion.data.choices[0].message.content
        };
      } else {
        log.error(completion.data)
        return { content: 'no choices' }
      }

    } catch (error) {
      log.error(error)
    }

  };
}

export default OpenAI;