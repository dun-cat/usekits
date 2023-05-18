import { PACKAGE_VERSION } from '@src/utils/constant';
import { program } from 'commander';
import path from 'path';
import PluginManager from './plugin-manager';

const bootstrap = () => {

  // 全局命令
  program.version(PACKAGE_VERSION, '-v, --version', '当前版本号');
  // 初始接受参数
  program.option('-d, --debug', '输出额外的调试信息');
  program.option('-y, --yes', '无弹框提示，所有操作默认通过，适合自动化环境');
  program.option('-h, --help', '使用帮助')



  // 插件初始化
  PluginManager.getInstance().load();


  // const aiPlugin = require(path.join(__dirname, "../../../../usekits-plugin-ai/dist/src/index.js"))
  // aiPlugin.default(program)

  // // create project
  // program
  //   .command('init')
  //   .option('-git', '是否初始化git')
  //   .action((options) => {
  //     runner.createProject(options);
  //   });
  program.parse();
}

function argsLength() {
  return program.args.length;
}

export default { bootstrap, argsLength }