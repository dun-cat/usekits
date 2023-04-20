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
  totalRecordedData: Buffer = Buffer.from('');
  keypressHandler;

  constructor() {
    super();
    this.ready();
  }

  private onReading(data: Buffer) {
    this.totalRecordedData = Buffer.concat([this.totalRecordedData, data])
    this.emit('recording', data);
  }

  private onStop() {
    this.emit('end', this.totalRecordedData);
    this.totalRecordedData = Buffer.from('');
  }

  private onError(error: Error) {
    this.emit('error', error);
  }

  private stop() {
    this.status = STATUS.READY;
    this.spinner.stop();
    if (this.keypressHandler) {
      process.stdin.off('keypress', this.keypressHandler)
    }
    this.onStop();
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
          interval: 1000, frames: [`${chalk.yellowBright('🎙')}`]
        };
        this.spinner.start();
        break;
      case STATUS.RECORDING:
        this.spinner.text = '说话中...';
        this.spinner.spinner = {
          "interval": 160,
          "frames": [
            "🔈",
            "🔉",
            "🔊",
            "🔉"
          ]
        };
        this.spinner.start();
        break;
    }

  }

  private ready() {
    this.setSpinner(STATUS.READY);
    this.keypressHandler = (str: string, key) => {
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
    };
    process.stdin.on('keypress', this.keypressHandler);
  }
}

export default Recorder;