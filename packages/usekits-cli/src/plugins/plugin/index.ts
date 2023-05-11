import { prompt } from 'inquirer';
import { Command } from "commander";
import ui, { createTable } from "./ui";
import { UseKitsCLI } from 'index';
import installer from './installer';
import log from '@src/utils/log';
import PluginManager, { PLUGIN_STATUS } from '@src/core/plugin-manager';
import chalk from 'chalk';
import ora from 'ora';


function execTasks(tasks: (() => Promise<any>)[]) {
  return tasks.reduce(function (promise, task) {
    return promise.then(task)
  }, Promise.resolve())
}

async function programHandler() {
  try {
    const step = await prompt(ui.menus);
    switch (step.do) {
      // 插件列表
      case 'list':
        const plugins = PluginManager.getInstance().getPlugins();
        createTable(plugins);
        break;
      // 移除插件
      case 'remove':
        if (PluginManager.getInstance().getPlugins().length === 0) {
          log.info('未找到已安装插件哦~')
          break;
        }
        const removeResult = await prompt(ui.remove);
        if (!removeResult.selectedPlugin) return;
        const sp = ora("插件删除中...").start();
        await PluginManager.getInstance().remove(removeResult.selectedPlugin);
        sp.succeed("删除成功！")
        break;
      // 启用和禁用
      case 'disableOrEnable':
        if (PluginManager.getInstance().getPlugins().length === 0) {
          log.info('未找到已安装插件哦~')
          break;
        }
        const disableResult = await prompt(ui.disableOrEnable);
        if (!disableResult.selectedPlugin) return;

        const status = PluginManager.getInstance().getStatus(disableResult.selectedPlugin);
        switch (status) {
          case PLUGIN_STATUS.DISABLED:
            PluginManager.getInstance().setStatus(disableResult.selectedPlugin, PLUGIN_STATUS.ENABLED);
            log.success(`${chalk.magentaBright(disableResult.selectedPlugin)} [${chalk.greenBright("On")}] 已启用！`)
            break;
          case PLUGIN_STATUS.ENABLED:
            PluginManager.getInstance().setStatus(disableResult.selectedPlugin, PLUGIN_STATUS.DISABLED);
            log.success(`${chalk.magentaBright(disableResult.selectedPlugin)} [${chalk.redBright("Off")}] 已禁用！`)
            break;
        }
        break;
      // 添加自定义插件
      case 'addCustomPlugins':
        if (!step.input) return;
        installer.add(step.input);
      // 添加官方插件
      case 'addOfficialPlugins':
        if (!step.selectedPlugin) return;
        execTasks([
          () => installer.add(step.selectedPlugin)
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