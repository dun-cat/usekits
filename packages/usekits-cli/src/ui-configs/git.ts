import chalk from 'chalk';

export const choices = [
  {
    name: '* feat     : 新特性',
    value: 'feat',
    defaultValue: '新增特性',
  },
  {
    name: '* fixed    : bug修复',
    value: 'fixed',
    defaultValue: 'bug修复',
  },
  {
    name: '* style    : 样式修复',
    value: 'style',
    defaultValue: '样式修复',
  },
  {
    name: '* perf     : 性能优化',
    value: 'perf',
    defaultValue: '性能优化',
  },
  {
    name: '* release  : 版本发布',
    value: 'release',
    defaultValue: '版本发布',
  },
  {
    name: '* refactor : 代码重构',
    value: 'refactor',
    defaultValue: '代码重构',
  },
  {
    name: '* test     : 测试用例更新',
    value: 'test',
    defaultValue: '测试用例更新',
  },
  {
    name: '* revert   : 代码回滚',
    value: 'revert',
    defaultValue: '代码回滚',
  },
  {
    name: '* temp     : 临时提交',
    value: 'temp',
    defaultValue: '临时提交',
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
