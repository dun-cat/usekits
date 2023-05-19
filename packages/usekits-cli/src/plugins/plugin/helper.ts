import log from '@src/utils/log';
import axios from 'axios';
import * as semver from 'semver';
import * as execa from 'execa';
const execaPromise = import('execa')
// export const registryUrl = 'https://registry.npmmirror.com';
export const registryUrl = process.env.npm_registry || 'https://registry.npmjs.com';

function splitScopedPackageVersion(packageName: string): { name: string, version: string } {
  const match = /^(@[^/]+\/)?([^@]+)(@(.+))?$/.exec(packageName);
  if (!match) {
    throw new Error(`Invalid package name: ${packageName}`);
  }
  const scope = match[1] || '';
  const name = match[2];
  const version = match[4] || '';
  return { name: `${scope}${name}`, version };
}


async function resolvePluginName(pluginName: string): Promise<{
  tarball: string;
  name: string;
  maxVersion: string;
} | null> {
  try {

    const { name, version: unResolveVersion } = splitScopedPackageVersion(pluginName)
    const response = await axios.get(`${registryUrl}/${name}`);
    const versions = Object.keys(response.data.versions);
    const v = semver.validRange(unResolveVersion || versions[versions.length - 1]);
    if (v === null) {
      log.error("请输入符合 Semver 语义化版本号");
      return null;
    }

    // 获取符合语义版本号的最大版本号
    const maxVersion = semver.maxSatisfying(versions, unResolveVersion);
    const apiUrl = `${registryUrl}/${name}/${maxVersion}`;
    const { data } = await axios.get(apiUrl);

    return {
      tarball: data.dist.tarball,
      name,
      maxVersion
    };
  } catch (error) {
    log.error(error)
    return null;
  }
}

export { resolvePluginName }