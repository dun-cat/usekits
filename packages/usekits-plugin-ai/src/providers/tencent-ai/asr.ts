import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';


function getConnectUrl() {
  const secretid = 'AKIDoVzGL8fuGVdW9VcT8bp2uZ2HIyO3UgeM';
  const timestamp = Math.floor(Date.now() / 1000);
  const expired = timestamp + 60 * 60 * 24 * 10;
  const nonce = Math.floor(Math.random() * 10000)
  const engine_model_type = '16k_zh';
  const voice_id = uuidv4();
  const resultUrl = new URL('wss://asr.cloud.tencent.com/asr/v2/1300883601');

  const params = { secretid, timestamp, expired, nonce, engine_model_type, voice_id };
  Object.keys(params).sort((a, b) => a.localeCompare(b)).
    forEach(key => resultUrl.searchParams.append(key, params[key]));

  const hmac = crypto.createHmac('sha1', "Ysyrb9VeaKp6EG4epnV1HNFuLXUCgvDR");
  const text = resultUrl.hostname + resultUrl.pathname + resultUrl.search;

  hmac.update(text);
  const signature = hmac.digest().toString('base64');
  console.log('signature', signature)
  resultUrl.searchParams.append('signature', signature);
  console.log(resultUrl.href)
  return resultUrl.href;
}

type Response = {
  code: number;
  message: string;
  voice_id: string;
  message_id: string;
  result: {
    /**
     * 识别结果类型：
     * 0：一段话开始识别
     * 1：一段话识别中，voice_text_str 为非稳态结果(该段识别结果还可能变化)
     * 2：一段话识别结束，voice_text_str 为稳态结果(该段识别结果不再变化)
     * 根据发送的音频情况，识别过程中可能返回的 slice_type 序列有：
     * 0-1-2：一段话开始识别、识别中(可能有多次1返回)、识别结束
     * 0-2：一段话开始识别、识别结束
     * 2：直接返回一段话完整的识别结果
     */
    slice_type: number;
    index: number;
    start_time: number;
    end_time: number;
    voice_text_str: string;
    word_size: number;
    word_list: {
      start_time: number;
      end_time: number;
      word: string;
      stable_flag: number; // 该词的稳态结果，0 表示该词在后续识别中可能发生变化，1 表示该词在后续识别过程中不会变化
    }[];
  }
}


function connect() {
  return new Promise((resolve) => {
    const ws = new WebSocket(getConnectUrl());

    ws.on('error', console.error);

    ws.on('open', function open() {
      console.log('connected');
      resolve('connected');
      // ws.send(Date.now());
    });

    ws.on('close', function close() {
      console.log('disconnected');
    });

    ws.on('message', function message(data: Response) {
      const response = JSON.parse(String(data));
      console.log(response);

      // setTimeout(function timeout() {
      //   ws.send(Date.now());
      // }, 500);
    });
  });

}


export default {
  connect
}