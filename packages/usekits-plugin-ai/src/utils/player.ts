import { log } from '@usekits/cli';
import { spawn } from 'child_process';
import Speaker from 'speaker';

const playBase64EncodedPcm = (base64EncodedPcm: string) => {

  return new Promise((resolve, reject) => {
    // 将 base64 编码的 PCM 数据解码为二进制数据
    const pcmData = Buffer.from(base64EncodedPcm, 'base64');

    try {
      // 创建 Speaker 实例
      const speaker = new Speaker({
        channels: 1,          // 声道数
        bitDepth: 16,         // 位深度
        sampleRate: 16000     // 采样率
      });
      speaker.on('flush', () => {
        speaker.close(true);
      });
      speaker.on('close', () => {
        resolve('');
      });
      // 将 PCM Buffer 写入 Speaker 输入流
      speaker.write(pcmData);
      speaker.end();
    } catch (error) {
      reject(error);
    }
  });

};

export { playBase64EncodedPcm }