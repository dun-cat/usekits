import loadModules from "@src/utils/module-dir-loader";
import { program } from "commander";
import { UseKitsCLI } from "index";
import * as fs from 'fs-extra';
import path from "path";
import { BASE_DIR_NAME } from "./config";
import log from '@src/utils/log';

export interface Plugin {
  name: string;
  homepage: string;
  version: string;
  description: string;
  path: string; // 插件的绝对安装路径
}

class PluginManager {
  private static instance: PluginManager;
  private readonly pluginsFilePath = path.resolve(BASE_DIR_NAME, 'plugins.json');
  private plugins: Plugin[];

  private constructor() { }

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

    // 读取 plugins.json 文件，获取安装的插件列表
    try {
      this.plugins = fs.readJSONSync(this.pluginsFilePath);
      this.plugins.forEach(pluginInfo => {
        require(pluginInfo.path)(program);
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
    // 将更新后的插件列表写回到 plugins.json 文件中
    await fs.writeJSON(this.pluginsFilePath, this.plugins, { spaces: 2 });
  }

  public async remove(pluginName: string): Promise<void> {
    // 在插件列表中找到对应的插件并将其移除
    const pluginIndex = this.plugins.findIndex(plugin => plugin.name === pluginName);
    if (pluginIndex !== -1) {
      this.plugins.splice(pluginIndex, 1);

      // 将更新后的插件列表写回到 plugins.json 文件中
      await fs.writeJson(this.pluginsFilePath, this.plugins);
    }
  }

  public getPlugins() {
    return this.plugins;
  }
}

export default PluginManager;
