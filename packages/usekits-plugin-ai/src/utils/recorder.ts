import EventEmitter from 'events';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import ora from 'ora';
import readline from 'readline';
import chalk from 'chalk';
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


enum STATUS {
  RECORDING, READY
}

class Recorder extends EventEmitter {
  spinner: ora.Ora = ora();
  rec: ChildProcessWithoutNullStreams;
  status: STATUS = STATUS.READY;

  constructor() {
    super();
    this.ready();
    // 监听 Node.js 程序的退出事件，退出时结束 rec 子进程
    process.on('exit', () => {
      this.rec && this.rec.kill();
    });
  }

  private onReading(data: Buffer) {
    this.emit('recording', data);
  }

  private onStop() {
    this.emit('end');
  }

  private onError(error: Error) {
    this.emit('error', error);
  }

  private stop() {
    this.status = STATUS.READY;
    this.spinner.stop();
    this.onStop();
    this.setSpinner(STATUS.READY);
    this.rec && this.rec.kill();

  }




  private start() {
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
    this.rec.stdout.on('data', (data) => this.onReading(data));
    this.rec.stdout.on('error', (error) => this.onError(error));
    this.status = STATUS.RECORDING;
    this.setSpinner(STATUS.RECORDING);
  }

  private setSpinner(type: STATUS) {
    switch (type) {
      case STATUS.READY:
        this.spinner.text = `按下${chalk.blueBright('空格键')}开始说话哦~~`;
        this.spinner.spinner = {
          interval: 1000, frames: ['']
        };
        this.spinner.start();
        break;
      case STATUS.RECORDING:
        this.spinner.text = '说话中...';
        this.spinner.spinner = 'arc';
        this.spinner.start();
        break;
    }

  }

  private ready() {
    this.setSpinner(STATUS.READY);
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      }
      if (key.name === 'space') {
        switch (this.status) {
          case STATUS.RECORDING:
            this.stop();
            break;
          case STATUS.READY:
            this.start();
            break;
        }

      }
    });
  }
}

export default Recorder;