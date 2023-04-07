import { execSync } from 'child_process';

const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
const TAOBAO_REGISTRY = 'https://r.npm.taobao.org';

let hasYarn: boolean;

function hasYarnInstalled() {
  if (hasYarn != null) {
    return hasYarn;
  }
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    hasYarn = true;
    return hasYarn;
  } catch (e) {
    hasYarn = false;
    return hasYarn;
  }
}

export {
  DEFAULT_REGISTRY, TAOBAO_REGISTRY
}