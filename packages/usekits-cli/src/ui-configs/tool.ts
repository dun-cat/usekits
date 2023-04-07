const choices = [
  {
    name: 'Git 初始化',
    value: 'git-init',
  },
  {
    name: '创建 Gitlab 项目',
    value: 'gitlab-init',
  },
];

module.exports = [
  {
    type: 'list',
    name: 'answer',
    message: 'What do you want to do?',
    choices,
  },
];
