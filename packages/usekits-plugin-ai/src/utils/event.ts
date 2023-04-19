import readline from 'readline';
const { Readable } = require('stream');
readline.emitKeypressEvents(process.stdin);
interface LongPressOptions {
  key?: string;
  timeout?: number;
  onDown?: () => void;
  onUp?: () => void;
}

function longPress({ key = ' ', timeout = 1000, onDown, onUp }: LongPressOptions): readline.Interface {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let timerId: NodeJS.Timeout | null = null;
  rl.on('keypress', (k: string) => {
    console.log('key', k)
    if (k === key && !timerId) {
      onDown?.();
      timerId = setTimeout(() => {
        onUp?.();
        timerId = null;
      }, timeout);
    }
  });

  rl.on('keyup', (k: string) => {
    if (k === key && timerId) {
      clearTimeout(timerId);
      onUp?.();
      timerId = null;
    }
  });

  return rl;
}

export default longPress;
