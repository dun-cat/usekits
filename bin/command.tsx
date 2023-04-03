
import React from 'react';
import yargs from 'yargs';
import gitPlugin from '@src/plugins/git';

import { render } from 'ink';
import App from '@src/views/App';

// yargs
//   .usage('Usage: $0 <command> [options]')
//   .command({
//     command: 'hello',
//     describe: 'Say hello',
//     handler: () => {
//       console.log('Hello World!');
//     }
//   })
//   .command({
//     command: 'bye',
//     describe: 'Say goodbye',
//     handler: () => {
//       console.log('Goodbye World!');
//     }
//   })
//   .help()
//   .alias('h', 'help')
//   .demandCommand(1)
//   .argv;

gitPlugin(yargs);

render(<App />);