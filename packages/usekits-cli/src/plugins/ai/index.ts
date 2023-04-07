import { Command } from "commander";
import { UseKitsCLI } from "global";
import readline from 'readline';

function handle() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('You: ');
  rl.prompt();

  rl.on('line', (input) => {
    console.table([{ a: 1, b: 3 }])
    rl.prompt();
  }).on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
}

const aiPlugin: UseKitsCLI.Plugin = (program: Command) => {

  const subProgram = program
    .command('ai')
    .description('AI 机器人')
    .action(handle);
}


export default aiPlugin

