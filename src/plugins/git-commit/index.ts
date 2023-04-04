import git from '@src/actions/git';
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

async function commit(options: Options) {
  const { push = false, yes, message } = options;
  const { hasProjectGit } = git;
  let spinner = null;
  if (!hasProjectGit()) {
    log.error('当前项目不是Git项目');
    return;
  }

  try {
    // commit
    if (!message) {
      const step2 = await prompt(ui.commit);
      await git.commit(step2);
    } else {
      await git.commit(message);
    }
    // 接受到 push 参数，需要推送
    if (!push) {
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
    .command('commit')
    .description('Git 提交代码')
    .alias('c')
    .option('-p, --push', '提交代码后，直接推送到远程仓库')
    .option('-m, --message', '提交消息')
    .action(commit);
}

export default gitPlugin;