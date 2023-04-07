import chalk from 'chalk';
import fuzzy from 'fuzzy';
const choices = [
  {
    name: '使用插件',
    value: 'use'
  },
  {
    name: '移除插件',
    value: 'remove'
  }, {
    name: '列出已安装插件',
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
  }, {
    type: 'input',
    name: 'pluginName',
    message: '请输入插件 NPM 包名：',
    when(answersSoFar: any) {
      return answersSoFar.do === 'use'
    }
  },
  {
    type: 'checkbox-plus',
    name: 'plugins',
    message: (answersSoFar: any) => {
      return `请选择需要移除的插件：`
    },
    highlight: true,
    searchable: true,
    source(answersSoFar: any, input: string) {
      input = input || '';
      return new Promise(((resolve) => {
        const fuzzyResult = fuzzy.filter(input, plugins);
        const data = fuzzyResult.map(function (element) {
          return element.original;
        });
        resolve(data);
      }));
    },
    when(answersSoFar: any) {
      return answersSoFar.do === 'remove'
    }
  }]
};
