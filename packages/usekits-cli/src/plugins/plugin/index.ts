import { prompt } from 'inquirer';
import { Command } from "commander";
import ui from "./ui";
import { UseKitsCLI } from 'index';
import installer from './installer';

function execTasks(tasks: (() => Promise<any>)[]) {
  return tasks.reduce(function (promise, task) {
    return promise.then(task)
  }, Promise.resolve())
}

async function programHandler() {
  try {
    const step = await prompt(ui.menus);
    switch (step.do) {
      case 'list':
        break;
      case 'remove':
        break;
      case 'addCustomPlugins':
        installer.add('@usekits/plugin-ai@^1.x');
      case 'addOfficialPlugins':
        execTasks([
          () => installer.add('@usekits/plugin-ai'),
          () => installer.add('@usekits/cli')
        ])
        break;
    }
  } catch (error) {
    throw error
  }

}

async function subProgramHandler() {
  console.log(this.args, this.opts())
}

const pluginPlugin: UseKitsCLI.Plugin = (program: Command) => {
  const subProgram = program
    .command('plugin')
    .description('插件管理')
    .alias('p')
    .action(programHandler);

  subProgram
    .command('add <...package-name>')
    .aliases(['a', 'install', 'i'])
    .description("添加插件")
    .option('-r, --registry', '指定安装源')
    .action(subProgramHandler);

  subProgram
    .command('remove <...package-name>')
    .aliases(['rm', 'uninstall', 'u'])
    .description("移除插件")
    .action(subProgramHandler);
}

export default pluginPlugin;