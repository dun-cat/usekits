import { Provider, Text } from "..";
import realTimeASR from "./real-time-rec";
import sentenceASR from './sentence-rec';
import { prompt } from 'inquirer';
import ui from "./ui";
import { accessKeyValidator } from "@src/validators/tencent";
import config from "@src/config";
import { ASR_TYPE } from "@src/utils/enum";
import Recorder from "@src/utils/recorder";

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

}

export default TencentAI;