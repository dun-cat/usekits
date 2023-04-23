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

  async listModels() {
    const response = await openai.listModels(axiosConfig);
    console.log(response)
  }


  async chat(text: string): Promise<Text> {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }, axiosConfig);

      // const completion = await openai.createCompletion({
      //   model: "gpt-3.5-turbo-0301",
      //   "prompt": "Say this is a test",
      // }, axiosConfig);

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
      return { content: '' }
    }

  };
}

export default OpenAI;