import { DoCLI } from "@src/type";
import { Command } from "commander";


function pluginHandler() {
  console.log(this.args, this.opts())
}

const pluginPlugin: DoCLI.Plugin = (program: Command) => {
  program
    .command('plugin')
    .description('插件管理')
    .alias('p')
    .argument('[install | add]', '安装插件')
    .argument('[uninstall | remove]', '删除插件')
    .option('-i, --push', '提交代码后，直接推送到远程仓库')
    .option('-m, --message', '提交消息')


    .action(pluginHandler);
}

export default pluginPlugin;