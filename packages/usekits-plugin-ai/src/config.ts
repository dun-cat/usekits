import { PluginConfig } from "@usekits/cli";

@PluginConfig()
class Config {
  tencent = {
    accessKey: {
      appId: "",
      secretId: "",
      secretKey: "",
    }
  }
  openAI = {
    apiKey: "",
    socksProxy: "",
  }
}

const config = new Config();
export default config;

