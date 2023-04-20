import EventEmitter from 'events';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import ora from 'ora';
import readline from 'readline';
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


class Recorder extends EventEmitter {
  spinner: ora.Ora = ora();
  rec: ChildProcessWithoutNullStreams;
  status: 'recording' | 'stoped' = 'stoped';
  onReading(data: Buffer) {
    this.emit('reading', data);
  }
  onError(error: Error) {

  }
  stop() {
    if (this.spinner) {
      this.spinner.text = '【空格键】开始讲话';
      this.spinner.stop();
    }
    this.rec && this.rec.kill();
  }
  constructor() {
    super();
    this.ready();
    // 监听 Node.js 程序的退出事件，退出时结束 rec 子进程
    process.on('exit', () => {
      this.rec && this.rec.kill();
    });
  }


  public start() {
    // 使用 spawn 方法创建 rec 子进程
    this.rec = spawn('rec', [
      '-t', 'raw',
      '-r', '16000',
      '-b', '16',
      '-c', '1',
      '-e', 'signed-integer',
      '--buffer', '1280',
      '-']);
    // 监听 rec 子进程的标准输出流，并在数据可用时进行处理
    this.rec.stdout.on('data', this.onReading);
    this.rec.stdout.on('error', this.onError);
    this.spinner.text = '说话中...';
    this.spinner.start();
  }

  private ready() {
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
      if (key.name === 'space') {
        switch (this.status) {
          case 'recording':
            this.status = 'stoped'
            this.stop();
            break;
          case 'stoped':
            this.status = 'recording'
            this.start();
            break;
        }

      }
    });
  }
}

export default Recorder;