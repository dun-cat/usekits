import { Provider, Text } from "..";
import asr from "./asr";

class TencentAI implements Provider {


  async startASR() {
    return asr.connect();
  }

}

export default TencentAI;