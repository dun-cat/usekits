import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const BASE_DIR_NAME = '.doit'

const configFile = path.join(os.homedir(), BASE_DIR_NAME, 'config.json');

const pluginConfigFile = path.join(os.homedir(), BASE_DIR_NAME, 'plugins.json');

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

export { getConfig, saveConfig, getPlugins }