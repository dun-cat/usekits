#!/usr/bin/env node

import requireDir from 'require-dir';
import { prompt, registerPrompt } from 'inquirer';
import core from '@src/core';
import menu from '@src/ui-configs/menu';
const uiConfig = requireDir('../src/ui-configs');
import runner from '../src/lib/runner';


registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));
registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

async function toolSubMenu() {
  const step2 = await prompt(uiConfig.tool);
  switch (step2.answer) {
    case 'git-init':
      runner.gitInit();
      break;
    case 'gitlab-init':
      runner.createGitlabProject();
      break;
    default:
      break;
  }
}
async function createUI() {
  const step1 = await prompt(menu);
  switch (step1.answer) {
    case 'commit':
      // runner.commit();
      break;
    case 'standard':
      runner.standard();
      break;
    case 'create_project':
      runner.createProject();
      break;
    case 'tool':
      toolSubMenu();
      break;
    case 'help':
      runner.help();
      break;
    default:
      break;
  }
}

// 启动
core.bootstrap();
// 如果无参数，直接展示入口 UI。
if (core.argsLength() === 0) {
  createUI();
} else {

}

