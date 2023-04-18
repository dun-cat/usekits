import { Provider, Text } from "..";
import asr from "./real-time-rec";
import { prompt } from 'inquirer';
import ui from "./ui";
import { accessKeyValidator } from "@src/validators/tencent";
import config from "@src/config";
import { ASR_TYPE } from "@src/utils/enum";

class TencentAI implements Provider {

  async startASR(type: ASR_TYPE = ASR_TYPE.REAL_TIME) {
    switch (type) {
      case ASR_TYPE.REAL_TIME:
        return asr.connect();
      case ASR_TYPE.SINGLE_SHOT:
        break;
      default:
        return null;
    }
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