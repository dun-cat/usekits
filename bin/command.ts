#!/usr/bin/env node

import yargs from 'yargs';
import gitPlugin from '@src/plugins/git';

yargs
  .usage('Usage: $0 <command> [options]')
  .command({
    command: 'hello',
    describe: 'Say hello',
    handler: () => {
      console.log('Hello World!');
    }
  })
  .command({
    command: 'bye',
    describe: 'Say goodbye',
    handler: () => {
      console.log('Goodbye World!');
    }
  })
  .command(gitPlugin)
  .help()
  .alias('h', 'help')
  .demandCommand(1)
  .argv;