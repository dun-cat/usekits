import { Command } from 'commander';

import log from './src/utils/log';
import cwd from './src/utils/cwd';
import PluginManager from '@src/core/plugin-manager';
import { PluginConfig } from '@src/core/config/decorator';

export {
  log, cwd, PluginManager, PluginConfig,
}

export declare namespace UseKitsCLI {

  type Plugin = (program: Command) => void;

  type GlobalOptions = {
    /**
     * 忽略所有确认提示，全部通过
     */
    yes: boolean;
  }
}