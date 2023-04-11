import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export const BASE_DIR_NAME = path.join(os.homedir(), '.usekits');

const configFile = path.join(BASE_DIR_NAME, 'config.json');

const pluginConfigFile = path.join(BASE_DIR_NAME, 'plugins.json');

const getPluginsDir = () => {
  const pluginDir = path.join(BASE_DIR_NAME, "plugins");
  // 检查目录是否存在
  if (!fs.existsSync(pluginDir)) {
    // 目录不存在，创建它
    fs.mkdirSync(pluginDir, { recursive: true });
  }

  return pluginDir;
}

interface Config {
  [key: string]: any;
}
let config: Config = null;

function getConfig(): Config {
  if (config !== null) {
    return config;
  }

  try {
    const fileContents = fs.readFileSync(configFile, 'utf-8');
    config = JSON.parse(fileContents);
  } catch (err) {
    config = {};
    saveConfig(config);
  }

  return config;
}

function saveConfig(config: Config): void {
  const configDir = path.dirname(configFile);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf-8');
}

function getPlugins() {
  let config = {};
  try {
    const fileContents = fs.readFileSync(pluginConfigFile, 'utf-8');
    config = JSON.parse(fileContents);
  } catch (err) {
    saveConfig(config);
  }

  return config;
}

export { getConfig, saveConfig, getPlugins, getPluginsDir }