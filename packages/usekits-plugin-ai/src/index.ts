import { Command } from "commander";
import { UseKitsCLI, log } from "@usekits/cli";
import chalk from 'chalk';
import inquirer from 'inquirer';
import readline from 'readline';
import { AIPlatorm, createAIProvider } from "./providers";
import { marked } from 'marked';
import ui from '@src/ui';
import Renderer from "./utils/marked-terminal";
import { ASR_TYPE } from "./utils/enum";


import ora from "ora";
marked.setOptions({
  // Define custom renderer
  renderer: new Renderer()
});



async function handle() {

  const tencentAI = createAIProvider(AIPlatorm.TENCENT_AI);
  const openAI = createAIProvider(AIPlatorm.OPEN_AI);

  async function openAiChat(text: string) {
    const spinner = ora();
    spinner.spinner = 'grenade';
    spinner.start();
    const aiText = await openAI.chat(text);
    spinner.stop();
    console.log(`\n${chalk.redBright('AI')}: ${marked(aiText.content)}`);
    return aiText;
  }

  const inputTypeResult = await inquirer.prompt(ui.inputType);
  switch (inputTypeResult.inputType) {
    case 'keyboard':
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.setPrompt(`${chalk.cyanBright('You')}: `);
      rl.prompt();
      rl.on('line', async (input) => {
        // open ai
        await openAiChat(input);

        rl.prompt();
      }).on('close', () => {
        console.log('Goodbye!');
        process.exit(0);
      });
      break;
    case 'audio':
      let loop = true
      while (loop) {
        try {
          // speech-to-text
          const myText = await tencentAI.startASR(ASR_TYPE.SINGLE_SHOT);
          console.log(`${chalk.cyanBright('You')}: ${myText.content}`);
          // open ai
          const aiText = await openAiChat(myText.content);
          // text-to-speech
          await tencentAI.playText(aiText.content);
        } catch (error) {
          loop = false;
          log.error(error);
          process.exit();
        }
      }
      break;
  }



}

const aiPlugin: UseKitsCLI.Plugin = (program: Command) => {

  const subProgram = program
    .command('aii')
    .description('AI 机器人')
    .action(handle);
}


export default aiPlugin;

