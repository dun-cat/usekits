import { execa } from 'execa';
import { TAOBAO_REGISTRY } from './npm';

export function install(options?) {
  let { registry } = options;
  if (!registry) registry = TAOBAO_REGISTRY;
  try {
    execa('npm', ['install', '--registry', registry]);
  } catch (error) {
    throw error;
  }
}
