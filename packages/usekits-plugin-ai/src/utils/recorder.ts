import EventEmitter from 'events';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import ora from 'ora';
import longPress from './event';




class Recorder extends EventEmitter {
  spinner: ora.Ora;
  rec: ChildProcessWithoutNullStreams;
  onReading(data: Buffer) {
    this.spinner = ora({
      text: '说话中...',
      spinner: {
        interval: 80, // Optional
        frames: ['█▒▒▒▒▒▒▒▒▒', '███▒▒▒▒▒▒▒', ' █████▒▒▒▒▒',
          ' ███████▒▒▒', ' ██████████']
      }
    }).start();
    this.emit('reading', data);
  }
  onError(error: Error) {

  }
  onStop() {
    this.spinner && this.spinner.stop();

  }
  constructor() {
    super();
    this.ready();
    // 监听 Node.js 程序的退出事件，退出时结束 rec 子进程
    process.on('exit', () => {
      this.rec && this.rec.kill();
    });
  }

  public reset() {
    this.rec && this.rec.kill();
    console.log('长按空格开始讲话')
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
  }

  private ready() {
    this.reset();
    console.log('ready')
    longPress({
      key: ' ',
      timeout: 6000,
      onDown: () => {
        console.log('down')
        this.start()
      },
      onUp: () => {
        console.log('up')
        this.onStop();
        this.reset()
      }
    });
  }
}

export default Recorder;