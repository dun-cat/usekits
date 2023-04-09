import { Command } from "commander";
import { UseKitsCLI } from "@usekits/cli";
import chalk from 'chalk';
import readline from 'readline';
import { AIPlatorm, createAIProvider } from "./providers";

function handle() {

  const ai = createAIProvider(AIPlatorm.WIT_AI);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(`${chalk.bgCyanBright('You')}: `);
  rl.prompt();

  rl.on('line', (input) => {
    ai.chat(input);
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


export default aiPlugin;

