import dayjs from "dayjs";
import * as tencentcloud from "tencentcloud-sdk-nodejs"
import { Text } from '..';
import Recorder from "@src/utils/recorder";
import config from "@src/config";
const ASRClient = tencentcloud.asr.v20190614.Client;
const client = new ASRClient({
  credential: {
    secretId: config.tencent.accessKey.secretId,
    secretKey: config.tencent.accessKey.secretKey,
  }
});

async function sentence(): Promise<Text> {
  return new Promise((resolve, reject) => {
    const recorder = new Recorder();
    recorder.on('end', async (data) => {
      try {
        const res = await client.SentenceRecognition({
          Data: data.toString('base64'),
          DataLen: data.length,
          EngSerViceType: "16k_zh",
          SourceType: 1,
          SubServiceType: 2,
          VoiceFormat: "pcm"
        });
        resolve({ content: res.Result });
      } catch (error) {
        reject(error)
      }
    });

  });

}

export default { sentence }