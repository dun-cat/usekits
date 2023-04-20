import { Command } from "commander";
import { UseKitsCLI } from "@usekits/cli";
import chalk from 'chalk';
import readline from 'readline';
import { AIPlatorm, createAIProvider } from "./providers";
import config from "./config";
import { record } from "./utils/recorder";
import { marked } from 'marked';
import Renderer from "./utils/marked-terminal";
marked.setOptions({
  // Define custom renderer
  renderer: new Renderer()
});
function handle() {

  const ai = createAIProvider(AIPlatorm.OPEN_AI);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(`${chalk.cyanBright('You')}: `);

  rl.prompt();

  rl.on('line', async (input) => {
    const text = await ai.chat(input)
    console.log(`${chalk.redBright('AI')}:\n${marked(text.content)}`);
    rl.prompt();
  }).on('close', () => {
    console.log('Goodbye!');
    process.exit(0);
  });
}

const aiPlugin: UseKitsCLI.Plugin = (program: Command) => {

  const subProgram = program
    .command('aii')
    .description('AI 机器人')
    .action(handle);
}


export default aiPlugin;

