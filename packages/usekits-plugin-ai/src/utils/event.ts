import readline from 'readline';
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  console.log(`Key pressed: ${key.name}, value: ${key.sequence}`);
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
});


