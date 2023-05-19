import { Provider, Text } from "..";
import realTimeASR from "./real-time-rec";
import sentenceASR from './sentence-rec';
import { ASR_TYPE } from "@src/utils/enum";
import { tts } from "./tts";
import { log } from "@usekits/cli";

export type TencentConfig = {
  appId: string;
  secretId: string;
  secretKey: string;
}

class TencentAI implements Provider {

  async startASR(type: ASR_TYPE = ASR_TYPE.SINGLE_SHOT): Promise<Text> {
    return sentenceASR.sentence();
    // switch (type) {
    //   case ASR_TYPE.REAL_TIME:
    //     return realTimeASR.connect();
    //   case ASR_TYPE.SINGLE_SHOT:
    //     return sentenceASR.sentence();
    //   default:
    //     return;
    // }
    // const { error } = accessKeyValidator.validate(config.tencent.accessKey)
    // try {
    //   const result = await prompt(ui.accessKey);
    //   console.log(result)
    // } catch (error) {
    //   console.log(error)
    // }


  }

  playText(text: string): Promise<void> {
    return tts(text);

  }

}

export default TencentAI;