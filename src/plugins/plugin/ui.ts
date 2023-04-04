import chalk from 'chalk';
import fuzzy from 'fuzzy';
const choices = [
  {
    name: '安装插件',
    value: 'install'
  },
  {
    name: '卸载插件',
    value: 'uninstall'
  }, {
    name: '列出插件',
    value: 'list',
  }
];

const plugins = ['123', '23453', '11']

export default {
  menus: [{
    type: 'list',
    name: 'do',
    message: '亲，你想做点什么呢?',
    choices,
  },
  {
    type: 'checkbox-plus',
    name: 'plugins',
    message: (answersSoFar: object) => {
      return `请选择需要${answersSoFar.do === 'uninstall' ? '卸载' : '安装'}的插件：`
    },
    highlight: true,
    searchable: true,
    source(answersSoFar: object, input: string) {
      input = input || '';
      return new Promise(((resolve) => {
        const fuzzyResult = fuzzy.filter(input, plugins);
        const data = fuzzyResult.map(function (element) {
          return element.original;
        });
        resolve(data);
      }));
    },
    when(answersSoFar: object) {
      return ['uninstall', 'install'].includes(answersSoFar.do)
    }
  }]
};
