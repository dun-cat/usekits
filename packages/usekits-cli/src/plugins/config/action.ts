import { getPluginConfigFile, saveConfig } from "@src/core/config";
import PluginManager from "@src/core/plugin-manager"
import log from "@src/utils/log"

function writeValue(obj: object, path: string, value: string): void {
  const pathList = path.split('.');

  for (let i = 0; i < pathList.length; i++) {
    const property = pathList[i];

    if (typeof obj !== 'object' || obj === null) {
      throw new Error('Invalid object');
    }

    if (property in obj && i < pathList.length - 1) {
      obj = obj[property];
    } else if (!(property in obj) && i < pathList.length - 1) {
      obj[property] = {};
      obj = obj[property];
    } else if (i === pathList.length - 1) {
      obj[property] = value;
    }
  }
}

function getValueByPath(obj: object, path: string): any {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (!value.hasOwnProperty(key)) {
      return undefined;
    }

    value = value[key];
  }

  return value;
}

function getConfig(pluginName: string) {
  const configFile = getPluginConfigFile(pluginName);
  return require(configFile);
}

async function list(pluginName: string) {
  console.log(getConfig(pluginName))
}
async function set(pluginName: string, key: string, value: string) {
  const configFile = getPluginConfigFile(pluginName);
  const config = require(configFile);
  writeValue(config, key, value);
  log.success('已修改')
  console.log(config)
  saveConfig(config, configFile);
}
async function get(pluginName: string, key: string) {
  const configFile = getPluginConfigFile(pluginName);
  const config = require(configFile);
  const value = getValueByPath(config, key);
  console.log(value)
}


function handle(actionType: 'list' | 'set' | 'get') {
  return function () {
    if (!Array.isArray(this.args)) {
      log.error('无效参数');
      return;
    }
    if (this.args.length === 0) {
      log.error('提供插件包名')
      return;
    }

    const pluginName = this.args[0];
    if (!PluginManager.getInstance().getPlugin(pluginName)) {
      log.error('无此插件~')
      return;
    }

    switch (actionType) {
      case 'list':
        list(pluginName);
        break;
      case 'set':
        set(pluginName, this.args[1], this.args[2])
        break;
      case 'get':
        get(pluginName, this.args[1]);
        break;
    }

  }

}




export default {
  handle
}