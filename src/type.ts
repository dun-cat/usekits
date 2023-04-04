

import { Command } from 'commander';

export const defaultGlobalOptions: DoCLI.GlobalOptions = {
  yes: false
}

export declare namespace DoCLI {
  type Plugin = (program: Command) => void;

  type GlobalOptions = {
    /**
     * 忽略所有确认提示，全部通过
     */
    yes: boolean;
  }
}