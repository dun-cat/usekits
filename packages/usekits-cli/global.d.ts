

import { Command } from 'commander';

export declare namespace UseKitsCLI {
  type Plugin = (program: Command) => void;

  type GlobalOptions = {
    /**
     * 忽略所有确认提示，全部通过
     */
    yes: boolean;
  }
}