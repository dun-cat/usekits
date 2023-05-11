import loadModules from "@src/utils/module-dir-loader";
import { program } from "commander";
import { UseKitsCLI } from "index";
import * as fs from 'fs-extra';
import path from "path";
import { BASE_DIR_NAME, getPluginsDir } from "./config";
import log from '@src/utils/log';

export enum PLUGIN_STATUS {
  ENABLED = 'enabled', DISABLED = 'disabled'
}

export interface Plugin {
  name: string;
  homepage: string;
  version: string;
  description: string;
  status: string;
  path: string; // 插件的绝对安装路径
}

class PluginManager {
  private static instance: PluginManager;
  private readonly pluginsFilePath = path.resolve(BASE_DIR_NAME, 'plugins.json');
  private plugins: Plugin[];
  public readonly pluginDataDir = path.join(BASE_DIR_NAME, 'data');

  private constructor() {
    // 确保路径存在，如果不存在则创建
    const dir = path.dirname(this.pluginsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // 检查文件是否存在
    if (!fs.existsSync(this.pluginsFilePath)) {
      // 如果文件不存在，创建一个新文件并写入内容
      fs.writeFileSync(this.pluginsFilePath, '[]');
    }
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }

    return PluginManager.instance;
  }

  public load() {
    const buildInPlugins = loadModules(path.join(__dirname, '../plugins'));
    // 加载内置插件
    for (const plugin of Object.values(buildInPlugins)) {
      plugin(program);
    }

    // 读取 plugins.json 文件，获取已安装的外部插件列表
    try {
      this.plugins = fs.readJSONSync(this.pluginsFilePath);
      this.plugins.forEach(plugin => {
        if (plugin.status === PLUGIN_STATUS.ENABLED) {
          require(plugin.path)(program);
        }
      })
    } catch (error) {
      log.error(error);
      this.plugins = [];
    }
  }

  public async register(plugin: Plugin): Promise<void> {
    const pluginIndex = this.plugins.findIndex((p) => p.name === plugin.name);
    if (pluginIndex !== -1) {
      this.plugins[pluginIndex] = plugin;
    } else {
      this.plugins.push(plugin);
    }
    await fs.writeJSON(this.pluginsFilePath, this.plugins, { spaces: 2 });
  }

  public async remove(pluginName: string) {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.name === pluginName);
    if (pluginIndex !== -1) {
      try {
        const deletePlugin = this.plugins[pluginIndex]
        this.plugins.splice(pluginIndex, 1);
        fs.writeJSONSync(this.pluginsFilePath, this.plugins);
        await fs.remove(path.join(getPluginsDir(), deletePlugin.name))
      } catch (error) {
        log.error(error)
      }
    }
  }

  public setStatus(pluginName: string, status: PLUGIN_STATUS) {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.name === pluginName);
    if (pluginIndex !== -1) {
      this.plugins[pluginIndex].status = status;
      fs.writeJSONSync(this.pluginsFilePath, this.plugins);
    } else {
      log.error("无此插件~")
    }
  }

  public getStatus(pluginName: string) {
    const pluginIndex = this.plugins.findIndex(plugin => plugin.name === pluginName);
    if (pluginIndex !== -1) {
      return this.plugins[pluginIndex].status;
    } else {
      log.error("无此插件~")
      return null
    }
  }

  public getPlugins() {
    return this.plugins || [];
  }
}

export default PluginManager;
