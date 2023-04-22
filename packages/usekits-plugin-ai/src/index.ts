import { Command } from "commander";
import { UseKitsCLI, log } from "@usekits/cli";
import chalk from 'chalk';
import { AIPlatorm, createAIProvider } from "./providers";
import { marked } from 'marked';
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
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });
  await openAI.chat('');
  return
  let loop = true
  while (loop) {
    try {
      const myText = await tencentAI.startASR(ASR_TYPE.SINGLE_SHOT);
      console.log(`${chalk.cyanBright('You')}: ${myText.content}`);
      const spinner = ora();
      spinner.spinner = 'grenade';
      spinner.start();
      const aiText = await openAI.chat(myText.content);
      spinner.stop();
      console.log(`\n${chalk.redBright('AI')}: ${marked(aiText.content)}`);
      await tencentAI.playText(aiText.content);
    } catch (error) {
      loop = false;
      log.error(error);
      process.exit();
    }
  }


  // rl.setPrompt(`${chalk.cyanBright('You')}: `);

  // rl.prompt();



  // rl.on('line', async (input) => {
  //   // const recorder = new Recorder();
  //   // recorder.on('reading', (data) => {
  //   //   console.log('hello')
  //   // })
  //   // recorder.start();
  //   // const text = await ai.chat(input)


  // console.log(`${chalk.redBright('AI')}: ${marked(text.content)}`);
  //   // rl.prompt();
  // }).on('close', () => {
  //   console.log('Goodbye!');
  //   process.exit(0);
  // });

}

const aiPlugin: UseKitsCLI.Plugin = (program: Command) => {

  const subProgram = program
    .command('aii')
    .description('AI 机器人')
    .action(handle);
}


export default aiPlugin;

