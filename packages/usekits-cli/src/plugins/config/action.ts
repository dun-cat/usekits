import PluginManager from "@src/core/plugin-manager"
import log from "@src/utils/log"

async function list(pluginName: string) {
  console.log(this.args, this.opts())
}
async function set(pluginName: string, key: string, value: string) {
  console.log(this.args, this.opts())
}
async function get(pluginName: string, key: string) {
  console.log(this.args, this.opts())
}

async function clear(pluginName: string) {
  console.log(this.args, this.opts())
}

function handle(actionType: 'list' | 'set' | 'get' | 'clear') {
  return function () {
    console.log(this.args, this.opts())
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
        list();
        break;
      case 'set':
        break;
      case 'get':
        break;
      case 'clear':
        break;
    }

  }

}




export default {
  handle
}