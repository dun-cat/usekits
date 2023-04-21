import * as tencentcloud from "tencentcloud-sdk-nodejs"

import config from "./config";
import { randomUUID } from "crypto";
import { log } from "@usekits/cli";
import { playBase64EncodedPcm } from "@src/utils/player";

const TTSClient = tencentcloud.tts.v20190823.Client;
const client = new TTSClient({
  credential: config.credential,
  region: 'ap-beijing',
});



async function tts(text: string): Promise<void> {
  try {
    const res = await client.TextToVoice({
      Text: text,
      Codec: 'pcm',
      VoiceType: 1008,
      SessionId: randomUUID()
    });
    await playBase64EncodedPcm(res.Audio);
  } catch (error) {
    log.error(error);
    return Promise.resolve();
  }

}

export { tts }