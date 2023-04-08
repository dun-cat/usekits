const CONFIG_KEYS = {
  ACCESS_TOKEN: 'access_token',
  GITLAB_HOST: 'gitlab_host',
};

// @ts-ignore
// 当前包版本号，rollup 构建注入
const PACKAGE_VERSION = DEFINE_PACKAGE_VERSION;

export {
  CONFIG_KEYS, PACKAGE_VERSION
};
