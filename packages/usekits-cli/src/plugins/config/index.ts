import { UseKitsCLI } from 'index';
import { Command } from 'commander';
import action from './action';

const configPlugin: UseKitsCLI.Plugin = (program: Command) => {

  const subProgram = program
    .command('config')
    .alias('conf')
    .argument('plugin', '插件包名')
    .argument('key', '配置项 Key')
    .argument('value', '配置项 Value')
    .description('插件配置管理')

  subProgram
    .command('list <plugin>')
    .alias('ls')
    .description('列出插件所有配置项')
    .action(action.handle('list'));
  subProgram
    .command('set <plugin> <key> <value>')
    .description('设置配置项')
    .action(action.handle('set'));
  subProgram
    .command('get <plugin> <key>')
    .description('获取指定 key 的配置项')
    .action(action.handle('get'));
  subProgram
    .command('clear <plugin>')
    .description('清除所有配置项')
    .action(action.handle('clear'));
}

export default configPlugin;