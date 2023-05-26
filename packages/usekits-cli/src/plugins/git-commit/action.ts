const execaPromise = import('execa')
import cwd from '@src/utils/cwd';
import log from '@src/utils/log';
import { copyFileSync, existsSync } from 'fs-extra';
import { resolve } from 'path';
import * as fs from 'fs';
let isProjectGit: boolean;

const deleteGitLockFile = (): void => {
  const gitFolderPath = '.git';
  const lockFileName = 'index.lock';
  const lockFilePath = `${gitFolderPath}/${lockFileName}`;

  if (fs.existsSync(lockFilePath)) {
    fs.unlinkSync(lockFilePath);
    console.log('Git lock file deleted.');
  }
};

async function hasProjectGit() {
  if (isProjectGit != null) {
    return isProjectGit;
  }
  try {
    await (await execaPromise).execa('git', ['status'], { cwd: cwd.get() });
    isProjectGit = true;
    return isProjectGit;
  } catch (error) {
    isProjectGit = false;
    return isProjectGit;
  }
}

/**
 * 初始化 git 项目
 */
async function init() {
  try {
    if (!existsSync(`${cwd.get()}/.gitignore`)) {
      copyFileSync(resolve(__dirname, '../template/.gitignore'), `${cwd.get()}/.gitignore`);
    }
    await (await execaPromise).execa('git', ['init'], { cwd: cwd.get() });
  } catch (error) {
    throw error;
  }
}

async function commit(answers) {
  let message = answers.msg;
  if (answers.type) {
    message = `${answers.type}: ${answers.msg || "code updated"}`;
  }
  try {
    const result = await (await execaPromise).execa('git', ['add', '*'], { cwd: cwd.get() });
    console.log('result', result)
    const { stdout } = await (await execaPromise).execa('git', ['commit', '-m', message.replace(/"/, '\\"')], {
      cwd: cwd.get(),
    });
    log.info(stdout)
  } catch (error) {
    throw error;
  }
}

async function push() {
  try {
    await (await execaPromise).execa('git', ['push'], { cwd: cwd.get() });
  } catch (error) {
    throw error;
  }
}

async function syncProjectToRemoteGitRepo(host, namespace, name) {
  try {
    commit({ type: 'feat', msg: '初始化' });
    await (await execaPromise).execa('git', [
      'push', '--set-upstream',
      `${host}/${namespace}/${name}.git`, 'master',
    ], { cwd: cwd.get() });
  } catch (error) {
    throw error;
  }
}

export default {
  hasProjectGit,
  commit,
  push,
  init,
  syncProjectToRemoteGitRepo,
  deleteGitLockFile
};
