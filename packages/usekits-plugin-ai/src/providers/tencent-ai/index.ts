import { Provider, Text } from "..";
import asr from "./asr";
import { prompt } from 'inquirer';
import ui from "./ui";
import { accessKeyValidator } from "@src/validators/tencent";
import config from "@src/config";

class TencentAI implements Provider {

  async startASR() {
    let passed = false;
    // const { error } = accessKeyValidator.validate(config.tencent.accessKey)
    try {
      const result = await prompt(ui.accessKey);
      console.log(result)
    } catch (error) {
      console.log(error)
    }




    return asr.connect();
  }

}

export default TencentAI;