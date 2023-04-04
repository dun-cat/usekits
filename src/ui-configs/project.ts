import downloadFile from 'download';
import os from 'os';
import { writeJSONSync, ensureFileSync, existsSync, readJSONSync, removeSync } from 'fs-extra';
// 脚手架下载地址
const scaffoldConfigUrl = 'http://gitlab.lumin.tech/lumin/static/raw/master/fe.scaffold.config.json';
// 脚手架配置本地存储位置
const scaffoldConfigPath = `${os.homedir()}/.door/scaffold.config.json`;
let choices = [];

/**
 * 转换参数名称
 * @param {array} data 脚手架配合列表
 */
function getChoices(data) {
  const newChoices = [];
  data.forEach((config) => {
    newChoices.push({ name: config.name, value: config.repo });
  });
  return newChoices;
}

/**
 * 下载更新脚手架配置
 */
function updateScaffoldConfig() {
  ensureFileSync(scaffoldConfigPath);
  downloadFile(scaffoldConfigUrl)
    .then((data) => {
      const json = JSON.parse(String(data));
      choices = getChoices(json);
      writeJSONSync(scaffoldConfigPath, json);
    })
    .catch((error) => {
      console.log(error);
    });
}


if (existsSync(scaffoldConfigPath)) {
  try {
    const data = readJSONSync(scaffoldConfigPath);
    choices = getChoices(data);
  } catch (error) {
    removeSync(scaffoldConfigPath);
    console.log(error);
  }
}
// updateScaffoldConfig();


module.exports = {
  choices,
  config: [
    {
      type: 'list',
      name: 'repo',
      message: '请选择你的脚手架类型',
      choices,
    },
  ],
  createGitlab: {
    type: 'confirm',
    name: 'createGitlab',
    message: '是否创建Gitlab项目？',
  },
};
