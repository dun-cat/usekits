import dayjs from "dayjs";
import * as tencentcloud from "tencentcloud-sdk-nodejs"
import { Text } from '..';
import Recorder from "@src/utils/recorder";
const ASRClient = tencentcloud.asr.v20190614.Client;
const client = new ASRClient({
  credential: {
    secretId: 'AKIDmQ7YjfLjutoVyA7rOgjV2LPfgZHpJerq',
    secretKey: 'ub7SZTO72lDRWYO0LWZQ2SdZFVhsrb9U',
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