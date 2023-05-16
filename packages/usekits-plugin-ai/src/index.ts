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
import config from "@src/config";
import openAIUI from "./providers/open-ai/ui";
import tencentAIUI from "./providers/tencent-ai/ui";
import { authValidator } from "./validators/tencent";
import { TencentConfig } from "./providers/tencent-ai";

marked.setOptions({
  // Define custom renderer
  renderer: new Renderer()
});

async function handle() {
  const openAI = createAIProvider(AIPlatorm.OPEN_AI);

  if (!config.openAI.apiKey) {
    const answer = await inquirer.prompt(openAIUI.accessKey);
    config.openAI.apiKey = answer.apiKey;
  }

  async function openAiChat(text: string) {
    const spinner = ora();
    spinner.spinner = 'grenade';
    spinner.start();
    const aiText = await openAI.chat(text);
    spinner.stop();
    console.log(`\n${chalk.redBright('AI')}: ${marked(aiText.content)}`);
    return aiText;
  }
  // 选择输入方式
  const inputTypeResult = await inquirer.prompt(ui.inputType);
  switch (inputTypeResult.inputType) {
    // 键盘
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
    // 语音识别
    case 'audio':
      const v = authValidator.validate(config.tencent.accessKey);
      if (v.error) {
        const result = await inquirer.prompt(tencentAIUI.accessKey) as TencentConfig;
        console.log(result)
        config.tencent.accessKey = result;
      }
      const tencentAI = createAIProvider(AIPlatorm.TENCENT_AI);
      const rll = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

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
    .command('ai')
    .description('AI 机器人')
    .action(handle);
}


export default aiPlugin;

