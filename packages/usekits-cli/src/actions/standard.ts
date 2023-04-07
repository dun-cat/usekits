import { existsSync, writeJsonSync, copySync, readJsonSync } from 'fs-extra';
import merge from 'lodash.merge';
import { resolve } from 'path';
import cwd from '../utils/cwd';
import log from '../utils/log';
import { install } from './install';

const addConfig = {
  devDependencies: {
    '@commitlint/cli': '^7.5.2',
    '@commitlint/config-conventional': '^7.5.0',
    'validate-commit-msg': '^2.14.0',
    'lint-staged': '^8.1.5',
    husky: '^1.3.1',
    eslint: '^5.15.2',
  },
  husky: {
    hooks: {
      'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      'pre-commit': 'lint-staged',
    },
  },
  'lint-staged': {
    'src/*.js': ['eslint --fix', 'git add'],
  },
};

function setup() {
  const configPath = `${cwd.get()}/package.json`;
  if (!existsSync(configPath)) {
    // log.error('未找到 package.json 文件');
    throw new Error('未找到 package.json 文件');
  }
  // Merge package.json
  const config = readJsonSync(configPath);
  const merged = merge(config, addConfig);
  writeJsonSync(configPath, merged, {
    spaces: 2,
  });
  // Add commitlintrc.js
  copySync(resolve(__dirname, '../template/.commitlintrc.js'), `${cwd.get()}/.commitlintrc.js`);
  // Install dependent packages
  install();
}

module.exports = {
  setup,
};
