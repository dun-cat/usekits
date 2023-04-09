import { init } from '@src/lib/config';
import runner from '@src/lib/runner';
import { PACKAGE_VERSION } from '@src/utils/constant';
import { program } from 'commander';
import PluginManager from './plugin-manager';

const bootstrap = () => {
  // init()

  // 全局命令
  program.version(PACKAGE_VERSION, '-v, --version', '当前版本号');
  // 初始接受参数
  program.option('-d, --debug', '输出额外的调试信息');
  program.option('-y, --yes', '无弹框提示，所有操作默认通过，适合自动化环境');

  // 插件初始化
  PluginManager.getInstance().load();

  // create project
  program
    .command('init')
    .option('-git', '是否初始化git')
    .action((options) => {
      runner.createProject(options);
    });
  program.parse();
}

function argsLength() {
  return program.args.length;
}

export default { bootstrap, argsLength }