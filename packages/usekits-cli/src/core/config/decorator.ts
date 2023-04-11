
import { createReactiveDecorator } from '@usekits/usekits-cache';
import path from 'path';
import 'reflect-metadata';
import { BASE_DIR_NAME } from '.';

export const MK_FILE_NAME = Symbol('persist-cache-file-name');
export const MK_PERSIST_CACHE_PATH = Symbol('persist-cache-path');

function PluginConfig(name = 'config') {

  return createReactiveDecorator({
    persist: true,
    path: path.join(BASE_DIR_NAME, 'data',)
  })
}


export { PluginConfig }

