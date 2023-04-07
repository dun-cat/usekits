'use strict';
module.exports = {
  extends: [ '@commitlint/config-conventional' ],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'ci',
        'docs',
        'feat',
        'fixed',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'temp',
        'release',
        'build'
      ],
    ]
  },
};
