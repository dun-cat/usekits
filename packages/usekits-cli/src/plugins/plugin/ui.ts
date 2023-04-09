import chalk from 'chalk';
import fuzzy from 'fuzzy';
import { Plugin, PLUGIN_STATUS } from '@src/core/plugin-manager';
const choices = [
  {
    name: '添加官方插件',
    value: 'addOfficialPlugins'
  },
  {
    name: '添加自定义插件',
    value: 'addCustomPlugins'
  },
  {
    name: '移除插件',
    value: 'remove'
  }, {
    name: '列出插件',
    value: 'list',
  }
];

const officalPlugins = ['@usekits/plugin-ai']

export default {
  menus: [{
    type: 'list',
    name: 'do',
    message: '亲，你想做点什么呢?',
    choices,
  }, {
    type: 'input',
    name: 'selectedPlugins',
    message: '请选择您要安装的官方插件：',
    when(answersSoFar: any) {
      return answersSoFar.do === 'addOfficialPlugins'
    }
  }, {
    type: 'input',
    name: 'pluginName',
    message: '请输入 NPM 包名：',
    when(answersSoFar: any) {
      return answersSoFar.do === 'addCustomPlugins'
    }
  }],
  remove: [{
    type: 'checkbox-plus',
    name: 'selectedPlugins',
    message: (answersSoFar: any) => {
      return `请选择需要移除的插件：`
    },
    highlight: true,
    searchable: true,
    source(answersSoFar: any, input: string) {
      input = input || '';
      return new Promise(((resolve) => {
        const fuzzyResult = fuzzy.filter(input, officalPlugins);
        const data = fuzzyResult.map(function (element) {
          return element.original;
        });
        resolve(data);
      }));
    }
  }]
};


function createTable(plugins: Plugin[]) {
  const Table = require('cli-table3');
  const table = new Table({
    wordWrap: true,
    colWidths: [undefined, 40],
    head: [chalk.cyan('Name'), chalk.cyan('Description'), chalk.cyan('Version'), chalk.cyan('Status')],
  });
  plugins.forEach(plugin => {
    const { name, version, description, homepage, status } = plugin;

    let coloredStatusText = status;
    switch (status) {
      case PLUGIN_STATUS.ENABLED:
        coloredStatusText = chalk.greenBright("On")
        break;
      case PLUGIN_STATUS.DISABLED:
        coloredStatusText = chalk.grey("Off");
    }
    table.push([homepage ? {
      content: name,
      href: homepage
    } : name, description, version, coloredStatusText]);
  })
  console.log(table.toString())
}

export {
  createTable
}
