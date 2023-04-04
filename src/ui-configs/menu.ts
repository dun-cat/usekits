const choices = [
  {
    name: '代码提交',
    value: 'commit',
  },
  {
    name: '创建项目',
    value: 'create_project',
  },
  {
    name: '规范增强',
    value: 'standard',
  },
  {
    name: '工 具 箱',
    value: 'tool',
  },
  {
    name: '使用帮助',
    value: 'help',
  },
];

export default [
  {
    type: 'list',
    name: 'answer',
    message: 'What do you want to do?',
    choices,
  },
];
