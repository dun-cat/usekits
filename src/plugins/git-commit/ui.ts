import chalk from 'chalk';

export const choices = [
  {
    name: '* feat     : 新特性',
    value: 'feat',
    defaultValue: 'feat: ',
  },
  {
    name: '* fixed    : Bug 修复',
    value: 'fixed',
    defaultValue: 'fixed: ',
  },
  {
    name: '* style    : 样式修复',
    value: 'style',
    defaultValue: 'style: ',
  },
  {
    name: '* perf     : 性能优化',
    value: 'perf',
    defaultValue: 'perf: ',
  },
  {
    name: '* release  : 版本发布',
    value: 'release',
    defaultValue: 'release: ',
  },
  {
    name: '* refactor : 代码重构',
    value: 'refactor',
    defaultValue: 'refactor: ',
  },
  {
    name: '* test     : 测试用例更新',
    value: 'test',
    defaultValue: 'test: ',
  },
  {
    name: '* revert   : 代码回滚',
    value: 'revert',
    defaultValue: 'revert: ',
  },
  {
    name: '* temp     : 临时提交',
    value: 'temp',
    defaultValue: 'temp: ',
  },
];

export default {
  choices,
  commit: [
    {
      type: 'autocomplete',
      name: 'type',
      message: `请选择 ${chalk.yellow('commit')} 类型？`,
      source(answersSoFar, input) {
        return new Promise(((resolve) => {
          const result = choices.filter(_ => _.name.indexOf(input || '') !== -1);
          resolve(result);
        }));
      },
    },
    {
      type: 'input',
      name: 'msg',
      message: `请输入 ${chalk.yellow('commit')} 信息: `,
    },
  ],
  push: {
    type: 'confirm',
    name: 'next',
    message: `是否 ${chalk.yellow('push')} 到远程仓库？`,
  },
};
