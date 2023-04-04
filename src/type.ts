

import commander from 'commander';


export declare namespace DoCLI {
  type Plugin = (commander: commander.CommanderStatic) => void;
}