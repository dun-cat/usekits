import { spawn } from 'child_process';

function to16BitPCM(input) {
  const dataLength = input.length * (16 / 8);
  const dataBuffer = new ArrayBuffer(dataLength);
  const dataView = new DataView(dataBuffer);
  let offset = 0;
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return dataView;
}
function to16kHz(audioData, sampleRate = 44100) {
  const data = new Float32Array(audioData);
  const fitCount = Math.round(data.length * (16000 / sampleRate));
  const newData = new Float32Array(fitCount);
  const springFactor = (data.length - 1) / (fitCount - 1);
  newData[0] = data[0];
  for (let i = 1; i < fitCount - 1; i++) {
    const tmp = i * springFactor;
    const before: any = Math.floor(tmp).toFixed();
    const after = Math.ceil(tmp).toFixed();
    const atPoint = tmp - before;
    newData[i] = data[before] + (data[after] - data[before]) * atPoint;
  }
  newData[fitCount - 1] = data[data.length - 1];
  return newData;
}

let audioData: any = [];
export function record(callback) {
  // 使用 spawn 方法创建 rec 子进程
  const rec = spawn('rec', [
    '-t', 'raw',
    '-r', '16000',
    '-b', '16',
    '-c', '1',
    '-e', 'signed-integer',
    '--buffer', '1280',
    '-']);

  // 监听 rec 子进程的标准输出流，并在数据可用时进行处理
  rec.stdout.on('data', (data) => {
    callback(data)
    // console.log(`received ${data.length} bytes of audio data`);
  });
  rec.stdout.on('error', (data) => {
    console.log(data)
    // console.log(`received ${data.length} bytes of audio data`);
  });

  // 监听 rec 子进程的退出事件
  rec.on('exit', (code, signal) => {
    console.log(`rec process exited with code ${code} and signal ${signal}`);
  });

  // 监听 Node.js 程序的退出事件，退出时结束 rec 子进程
  process.on('exit', () => {
    rec.kill();
  });
}
