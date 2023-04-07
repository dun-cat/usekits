
import loadModules from "@src/utils/module-dir-loader";
import { program } from "commander";
import { UseKitsCLI } from "global";
import path from "path";

const buildInPlugins = loadModules(path.join(__dirname, '../plugins'));

class PluginManager {
  plugins = new Map<string, any>();

  init() {
    // 应用内置插件
    Object.values(buildInPlugins).forEach((plugin: UseKitsCLI.Plugin) => {
      plugin(program)
    })
  }

  add(name: string, plugin) {
    if (!this.plugins.has(name)) {
      this.plugins.set(name, plugin)
    }
  }

  remove(name: string) {
    if (this.plugins.has(name)) {
      this.plugins.delete(name)
    }
  }

  load() {

  }

  install() {

  }
}

const pluginManager = new PluginManager();

export default pluginManager;