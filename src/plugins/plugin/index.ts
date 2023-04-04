import { DoCLI } from "@src/type";
import { prompt } from 'inquirer';
import { Command } from "commander";
import ui from "./ui";
import action from './action';

export interface Options extends DoCLI.GlobalOptions {
  /**
   * 是否推送到远程仓库
   */
  push?: boolean;
  /**
   * 提交消息
   */
  message?: string;
}

async function programHandler() {
  try {
    const step = await prompt(ui.menus);
    console.log(step)
    switch (step.do) {
      case 'list':

        break;
      case 'uninstall':

        break;
      case 'install':

        break;
    }

  } catch (error) {
    throw error
  }

}

async function subProgramHandler() {
  console.log(this.args, this.opts())
}

const pluginPlugin: DoCLI.Plugin = (program: Command) => {
  const subProgram = program
    .command('plugin')
    .description('插件管理')
    .alias('p')
    .action(programHandler);

  subProgram
    .command('install <...package-name>')
    .aliases(['i', 'add'])
    .description("安装插件")
    .option('-r, --registry', '指定安装源')
    .action(subProgramHandler);

  subProgram
    .command('uninstall <...package-name>')
    .aliases(['remove', 'u'])
    .description("卸载插件")
    .action(subProgramHandler);
}

export default pluginPlugin;