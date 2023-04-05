import git from './action';
import { DoCLI } from '@src/type';
import log from '@src/utils/log';
import { prompt } from 'inquirer';
import { Command } from 'commander';
import ora from 'ora';
import ui from './ui';

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

async function commit() {
  const [message] = this.args
  console.log('this.opts()', this.opts())
  const { push = true, yes } = this.opts() as Options;
  const { hasProjectGit } = git;
  let spinner = null;
  if (!hasProjectGit()) {
    log.error('当前项目不是Git项目');
    return;
  }

  try {
    // 提交
    if (!message) {
      const step2 = await prompt(ui.commit);
      await git.commit(step2);
    } else {
      await git.commit({ msg: message });
    }
    // 接受到 push 参数，需要推送
    if (push) {
      if (!yes) {
        const step3 = await prompt(ui.push);
        if (!step3.next) return;
      }
      spinner = ora('推送中...').start();
      await git.push();
      spinner.succeed('推送成功');
    }

  } catch (error) {
    if (spinner) {
      spinner.fail('推送失败');
    }
    log.error(error);
  }
}

const gitPlugin: DoCLI.Plugin = (program: Command) => {
  program
    .command('commit [message]')
    .description('Git 提交代码')
    .alias('c')
    .option('-np, --no-push', '提交代码后，是否推送到仓库，默认给予推送提示弹框。')
    .action(commit);
}

export default gitPlugin;