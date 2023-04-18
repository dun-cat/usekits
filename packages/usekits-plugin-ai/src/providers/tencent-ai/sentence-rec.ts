import dayjs from "dayjs";
import * as tencentcloud from "tencentcloud-sdk-nodejs"

const ASRClient = tencentcloud.asr.v20190614.Client;


function sentence() {
  const client = new ASRClient({
    credential: {
      secretId: '',
      secretKey: '',
    }
  });
  client.SentenceRecognition({
    EngSerViceType: "16k_zh",
    SourceType: 1, // 语音数据来源。0：语音 URL；1：语音数据（post body）。
    VoiceFormat: "pcm"
  }).then();
}