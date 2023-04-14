import { spawn } from 'child_process';


export function record(callback) {
  // 使用 spawn 方法创建 rec 子进程
  const rec = spawn('rec', ['-t', 'raw', '-r', '16000', '-b', '16', '-c', '1', '-e', 'signed-integer', '-']);

  // 监听 rec 子进程的标准输出流，并在数据可用时进行处理
  rec.stdout.on('data', (data) => {
    // callback(data)
    console.log(`received ${data.length} bytes of audio data`);
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
