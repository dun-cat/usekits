import { findPackageJson } from '@src/utils/file';
import { createReactiveDecorator } from '@usekits/usekits-cache';
import path from 'path';
import { BASE_DIR_NAME } from '.';

function PluginConfig() {

  const stack = new Error().stack;
  const callerModulePath = stack.split('\n')[2].trim().match(/\((.*):\d+:\d+\)/)[1];

  const pkgPath = findPackageJson(callerModulePath);
  const pkg = require(pkgPath);
  return createReactiveDecorator({
    persist: true,
    path: path.join(BASE_DIR_NAME, 'data', pkg.name, 'confg', `default.json`)
  })
}


export { PluginConfig }

