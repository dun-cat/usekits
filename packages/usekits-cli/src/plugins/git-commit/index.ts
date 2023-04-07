import git from './action';
import log from '@src/utils/log';
import { prompt } from 'inquirer';
import { Command } from 'commander';
import ora from 'ora';
import ui from './ui';
import { UseKitsCLI } from 'global';

export interface Options extends UseKitsCLI.GlobalOptions {
  /**
   * 禁止推送到远程仓库
   */
  disablePush?: boolean;
}

async function commit() {
  const [message] = this.args
  const { disablePush = false, yes } = this.opts();
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
    // 接收到 --disable-push 选项，忽略推送
    if (disablePush) return

    // 未接收到 yes 选项，弹框提示是否推送
    if (!yes) {
      const step3 = await prompt(ui.push);
      if (!step3.next) return;
    }
    spinner = ora('推送中...').start();
    await git.push();
    spinner.succeed('推送成功');

  } catch (error) {
    if (spinner) {
      spinner.fail('推送失败');
    }
    log.error(error);
  }
}

const gitPlugin: UseKitsCLI.Plugin = (program: Command) => {
  program
    .command('commit [message]')
    .description('Git 提交代码')
    .alias('c')
    .option('--disable-push', '提交代码后，是否推送到仓库，默认给予推送提示弹框。')
    .action(commit);
}

export default gitPlugin;