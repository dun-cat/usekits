import commander from 'commander';
import runner from './runner';

global._debug_ = false;

function init() {
  commander.version('0.0.1');
  // 初始接受参数
  commander.option('-d, --debug', '输出额外的调试信息');
  // commit
  commander
    .command('commit')
    .description('提交代码')
    .alias('c')
    .option('-p, --push', '提交代码后，直接 push 到远程仓库')
    .action((options) => {
      runner.commit(options);
    });
  // create project
  commander
    .command('init')
    .option('-git', '是否初始化git')
    .action((options) => {
      runner.createProject(options);
    });
  commander.parse(process.argv);
  global._debug_ = !!commander.debug;
}

function argsLength() {
  return commander.args.length;
}

export default {
  init,
  argsLength,
};
