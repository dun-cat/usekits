import dayjs from "dayjs";
import * as tencentcloud from "tencentcloud-sdk-nodejs"
import { Text } from '..';
const ASRClient = tencentcloud.asr.v20190614.Client;


async function sentence(): Promise<Text> {
  const client = new ASRClient({
    credential: {
      secretId: '',
      secretKey: '',
    }
  });
  const res = await client.SentenceRecognition({
    EngSerViceType: "16k_zh",
    SourceType: 1,
    VoiceFormat: "pcm"
  });
  return { content: res.Result }
}

export default { sentence }