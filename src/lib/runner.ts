import requireDir from 'require-dir';

import ora from 'ora';
import { prompt } from 'inquirer';
import { emptyDirSync, readJSONSync, existsSync } from 'fs-extra';
import open from 'open';
import { CONFIG_KEYS } from '../utils/constant';
import { save, config } from '../lib/config';
import { getGitlabChoices } from '../lib/help';
import cwd from '../utils/cwd';

const uiConfig = requireDir('../ui-configs');
const actions = requireDir('../actions');
import log from '../utils/log';

const service = requireDir('../service');

/**
 * 提交 git 代码
 * @param {object} options 命令行参数
 */
async function commit(options = {}) {
  const { hasProjectGit } = actions.git;
  const { push } = options;
  let spinner = null;
  if (!hasProjectGit(cwd.get())) {
    log.error('当前项目不是Git项目');
    return;
  }

  try {
    // commit
    const step2 = await prompt(uiConfig.git.commit);
    actions.git.commit(step2);
    // 接受到-p参数，忽略提示，直接push
    if (!push) {
      const step3 = await prompt(uiConfig.git.push);
      if (!step3.next) return;
    }
    spinner = ora('推送中...').start();
    actions.git.push();
    spinner.succeed('推送成功');
  } catch (error) {
    if (spinner) {
      spinner.fail('推送失败');
    }
    log.error(error);
  }
}

/**
 * 规范增强
 */
function standard() {
  const spinner = ora('设置中...').start();
  try {
    actions.standard.setup();
  } catch (error) {
    spinner.fail('设置失败！');
    log.error(error);
    return;
  }
  spinner.succeed('设置完成！');
}

/**
 * 创建项目
 * @param {object} options 命令行参数
 */
async function createProject(options) {
  const step2 = await prompt(uiConfig.project.config);
  if (!cwd.isEmpty(cwd.get())) {
    const notEmptyDirCreate = await prompt({
      type: 'confirm',
      name: 'is',
      message: '当前目录含有内容，是否删除内容？',
    });
    if (!notEmptyDirCreate.is) {
      log.error('已取消创建');
      return;
    }
    // 删除当前目录下的内容
    emptyDirSync(cwd.get());
  }

  const { repo } = step2;
  const { name } = uiConfig.project.choices.filter(_ => _.value === repo)[0];
  const spinner = ora('创建中...').start();
  try {
    await actions.project.create(name, repo);
  } catch (error) {
    spinner.fail('创建失败！');
    log.error(error);
    return;
  }
  spinner.succeed('创建完成！');
}

async function setGitlabHost() {
  const { gitlabHost } = await prompt(uiConfig.gitlab.gitlabHost);
  if (gitlabHost) {
    save(CONFIG_KEYS.GITLAB_HOST, gitlabHost);
    return Promise.resolve(gitlabHost);
  }
  return setGitlabHost();
}

/**
 * 创建 gitlab 项目
 * @param {object} options 输入参数
 */
async function createGitlabProject(options) {
  const { syncProjectToRemoteGitRepo, hasProjectGit, init } = actions.git;

  // 设置 access token
  const { getAccessToken, checkToken, setAccessToken, getNamespaces } = service.gitlab;
  try {
    const token = getAccessToken();
    await checkToken(token);
  } catch (err) {
    await prompt(uiConfig.gitlab.token).then(async (out) => {
      try {
        await checkToken(out.token);
        setAccessToken(out.token);
        save(CONFIG_KEYS.ACCESS_TOKEN, out.token); // 本地化存储
      } catch (error) {
        log.error(`${error.response.status}：${error.response.statusText}`);
        createGitlabProject.call(this, options);
      }
    });
  }

  // 设置 gitlab host
  if (!config[CONFIG_KEYS.GITLAB_HOST]) {
    await setGitlabHost();
  }

  // 设置项目空间
  const { data } = await getNamespaces();
  const choices = getGitlabChoices(data);
  const { namespace } = await prompt({ ...uiConfig.gitlab.namespace, choices });


  // 设置项目名称
  let projectName = '';
  const pkgPath = `${cwd.get()}/package.json`;
  let usePkgName = false;
  if (existsSync(pkgPath)) {
    const { usePackageName } = await prompt(uiConfig.gitlab.usePackageName);
    usePkgName = usePackageName;
  }

  if (usePkgName) {
    const { name } = readJSONSync(pkgPath);
    projectName = name;
  } else {
    const { name } = await prompt(uiConfig.gitlab.projectName);
    projectName = name;
  }

  // 初始化 git
  if (!hasProjectGit(cwd.get())) init();
  try {
    syncProjectToRemoteGitRepo(config[CONFIG_KEYS.GITLAB_HOST], namespace, projectName);
    ora().succeed('创建成功');
    open(`${config[CONFIG_KEYS.GITLAB_HOST]}/${namespace}/${projectName}`);
  } catch (error) {
    ora().fail('创建失败');
    log.error(error);
  }
}

/**
 * 初始化 git
 */
async function gitInit() {
  const { hasProjectGit, init } = actions.git;
  // const { createGitlab}
  if (hasProjectGit(cwd.get())) {
    log.error('已存在Git项目！');
    return;
  }
  try {
    init();
    log.success('Git初始化成功！');
    const createGitlab = await prompt(uiConfig.project.createGitlab);
    if (createGitlab) {
      createGitlabProject();
    }
  } catch (error) {
    log.error(error);
  }
}

function help() {

}

export default {
  gitInit,
  commit,
  standard,
  createProject,
  createGitlabProject,
  help,
};
