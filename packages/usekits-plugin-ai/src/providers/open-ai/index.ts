import { log } from "@usekits/cli";
import { Configuration, OpenAIApi } from "openai";
import { SocksProxyAgent } from 'socks-proxy-agent';


import { Provider, Text } from "..";
const proxy = process.env.socks_proxy || 'socks://127.0.0.1:1081';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

var agent = new SocksProxyAgent(proxy);
const axiosConfig = {
  httpsAgent: agent,
  httpAgent: agent
}

class OpenAI implements Provider {
  async chat(text: string): Promise<Text> {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0301",
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