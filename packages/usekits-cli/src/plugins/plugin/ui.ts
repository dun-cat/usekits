import chalk from 'chalk';
import PluginManager, { Plugin, PLUGIN_STATUS } from '@src/core/plugin-manager';
const choices = [
  {
    name: '插件列表',
    value: 'list',
  },
  {
    name: '添加官方插件',
    value: 'addOfficialPlugins'
  },
  {
    name: '添加自定义插件',
    value: 'addCustomPlugins'
  },
  {
    name: '插件删除',
    value: 'remove'
  },
  {
    name: '插件(启用/禁用)',
    value: 'disableOrEnable'
  }
];

const getPluginChoices = () => PluginManager.getInstance().getPlugins()
  .map((plugin) => {
    let statusText = plugin.status
    switch (plugin.status) {
      case PLUGIN_STATUS.DISABLED:
        statusText = chalk.redBright('Off')
        break;
      case PLUGIN_STATUS.ENABLED:
        statusText = chalk.greenBright('On')
        break;
    }
    return {
      name: `${plugin.name} [${statusText}]`,
      value: plugin.name
    }
  })

const officialPlugins = ['@usekits/plugin-ai'];

export default {
  menus: [{
    type: 'list',
    name: 'do',
    message: '亲，你想做点什么呢?',
    choices,
  }, {
    type: 'list',
    name: 'selectedPlugin',
    message: '请选择您要安装的官方插件：',
    choices: officialPlugins,
    when(answersSoFar: any) {
      return answersSoFar.do === 'addOfficialPlugins'
    }
  }, {
    type: 'input',
    name: 'input',
    message: '请输入 NPM 包名：',
    when(answersSoFar: any) {
      return answersSoFar.do === 'addCustomPlugins'
    }
  }],
  remove: [{
    type: 'list',
    name: 'selectedPlugin',
    message: `选择要移除的插件：`,
    highlight: true,
    searchable: true,
    choices: getPluginChoices
  }],
  disableOrEnable: [{
    type: 'list',
    name: 'selectedPlugin',
    message: '选择要 (启用/禁用) 的插件：',
    choices: getPluginChoices
  }]
};


function createTable(plugins: Plugin[]) {
  const Table = require('cli-table3');
  const table = new Table({
    wordWrap: true,
    colWidths: [undefined, 40],
    style: {
      hAlign: 'center',
    },
    head: [chalk.cyan('Name'), {
      content: chalk.cyan('Description'),
      hAlign: 'center',
    }, chalk.cyan('Version'), chalk.cyan('Status')],
  });
  plugins.forEach(plugin => {
    const { name, version, description, homepage, status } = plugin;

    let coloredStatusText = status;
    switch (status) {
      case PLUGIN_STATUS.ENABLED:
        coloredStatusText = chalk.greenBright("On")
        break;
      case PLUGIN_STATUS.DISABLED:
        coloredStatusText = chalk.redBright("Off");
    }
    table.push([homepage ? {
      content: name,
      href: homepage
    } : name, description, version, coloredStatusText]);
  })
  if (plugins.length === 0) {
    table.push([{ content: '暂无任何插件哦~', colSpan: 4, hAlign: 'center' }])
  }
  console.log(table.toString())
}

export {
  createTable
}
