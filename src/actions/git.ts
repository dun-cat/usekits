import execa from 'execa';
import { copyFileSync, existsSync } from 'fs-extra';
import { resolve } from 'path';
import log from '../utils/log';
import cwd from '../utils/cwd';
import { choices } from '../ui-configs/git';

let isProjectGit: boolean;

function hasProjectGit() {
  if (isProjectGit != null) {
    return isProjectGit;
  }
  try {
    execa.sync('git', ['status'], { cwd: cwd.get() });
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
function init() {
  try {
    if (!existsSync(`${cwd.get()}/.gitignore`)) {
      copyFileSync(resolve(__dirname, '../template/.gitignore'), `${cwd.get()}/.gitignore`);
    }
    execa.sync('git', ['init'], { cwd: cwd.get() });
  } catch (error) {
    throw error;
  }
}

function commit(answers) {
  const { defaultValue } = choices.filter(item => answers.type === item.value)[0];
  const message = `${answers.type}:  ${answers.msg || defaultValue}`;
  try {
    execa.sync('git', ['add', '*'], { cwd: cwd.get() });
    const result = execa.sync('git', ['commit', '-m', message.replace(/"/, '\\"')], {
      cwd: cwd.get(),
    });
    log.info(result.stdout);
  } catch (error) {
    throw error;
  }
}

function push() {
  try {
    execa.sync('git', ['push'], { cwd: cwd.get() });
  } catch (error) {
    throw error;
  }
}

async function syncProjectToRemoteGitRepo(host, namespace, name) {
  try {
    commit({ type: 'feat', msg: '初始化' });
    execa.sync('git', [
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
};
