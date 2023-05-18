import { log } from "@usekits/cli";
import { Configuration, OpenAIApi } from "openai";
import config from "@src/config";
import { SocksProxyAgent } from 'socks-proxy-agent';


import { Provider, Text } from "..";
const proxy = config.openAI.socksProxy;
class OpenAI implements Provider {

  private openai: OpenAIApi;
  private axiosConfig: any;

  constructor() {
    const configuration = new Configuration({
      apiKey: config.openAI.apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    if (proxy) {
      const agent = new SocksProxyAgent(proxy);
      this.axiosConfig = {
        httpsAgent: agent,
        httpAgent: agent
      }
    } else {
      this.axiosConfig = {}
    }
  }

  async listModels() {
    const response = await this.openai.listModels(this.axiosConfig);
    console.log(response)
  }


  async chat(text: string): Promise<Text> {
    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }, this.axiosConfig);

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