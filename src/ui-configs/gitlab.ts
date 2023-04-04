export default {
  token: [
    {
      type: 'input',
      name: 'token',
      message: '请输入 access token:',
    },
  ],
  namespace: {
    type: 'list',
    name: 'namespace',
    message: '请选择空间(用户名或分组)？',
  },
  usePackageName: {
    type: 'confirm',
    name: 'usePackageName',
    message: '使用package.json -> name字段作为项目名称？',
  },
  projectName: [
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称：',
    },
  ],
  gitlabHost: [
    {
      type: 'input',
      name: 'gitlabHost',
      message: '请输入 gitlab host：',
    },
  ],
};
