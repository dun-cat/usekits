import fs from 'fs';
const execaPromise = import('execa')
import ProgressBar from 'progress';
import * as tar from 'tar';
import * as zlib from 'zlib';
import url from 'url';
import axios from 'axios';
import chalk from 'chalk';
import path from 'path';
import * as os from 'os';
import { getPluginsDir } from '@src/core/config';
import cwd from '@src/utils/cwd';
import log from '@src/utils/log';
import cliProgress from 'cli-progress';
// import bytes from 'bytes';
import ora from 'ora';
import { resolvePluginName } from './helper';
import PluginManager from '@src/core/plugin-manager';

type DownloadOptions = {
  url: string;
}

async function unPack(originFile: string, name: string): Promise<{ unpackDir: string; localPackage: any; }> {
  const unpackDir = path.join(getPluginsDir(), name)
  const readStream = fs.createReadStream(originFile);
  const unzipStream = zlib.createGunzip();
  await fs.promises.mkdir(unpackDir, { recursive: true });
  const extractStream = tar.extract({
    cwd: unpackDir,
    strip: 1
  });
  readStream.pipe(unzipStream).pipe(extractStream);
  return new Promise((resolve, reject) => {
    extractStream.on('finish', () => {
      resolve({
        unpackDir,
        localPackage: require(path.join(unpackDir, 'package.json'))
      });
    });
    readStream.on('error', reject);
    unzipStream.on('error', reject);
    extractStream.on('error', reject);
  });
}

function download(fileUrl: string, pluginName: string): Promise<{ targetFile: string; }> {
  const parsedUrl = url.parse(fileUrl);
  const fileName = parsedUrl.pathname.split('/').pop();

  return new Promise((resolve, reject) => {
    const targetFile = path.join(os.tmpdir(), fileName)
    const file = fs.createWriteStream(targetFile);
    axios(fileUrl, { method: 'GET', responseType: 'stream', maxRedirects: 3 }).then((res) => {
      const totalSize = parseInt(res.headers['content-length'], 10);
      let downloadedSize = 0;

      const progressBar = new ProgressBar(`:status [:bar] :percent`, {
        width: 10,
        complete: chalk.greenBright('-'),
        incomplete: ' ',
        total: totalSize,
      });

      res.data.on('data', (chunk: Buffer) => {
        downloadedSize += chunk.length;
        progressBar.tick(chunk.length, {
          status: downloadedSize === totalSize ? `${chalk.green('✔')} [${chalk.magenta(pluginName)}] Downloaded` : `[${chalk.magenta(pluginName)}] Downloading`,
          speed: `${(downloadedSize / 1024 / progressBar.elapsed).toFixed(2)} KB/s`
        });

      });
      res.data.on('end', () => {
        resolve({ targetFile });
      });
      res.data.on('error', (error: any) => {
        log.error(`Error downloading ${fileName}: ${error.message}`);
        file.close();
        fs.unlinkSync(path.join(os.tmpdir(), fileName));
        reject(error);
      });
      res.data.pipe(file);
    }).catch((error: any) => {
      log.error(`Error downloading ${fileName}: ${error.message}`);
      file.close();
      fs.unlinkSync(path.join(os.tmpdir(), fileName));
      reject(error);
    });
  });
}

async function add(pluginName: string) {
  const pkg = await resolvePluginName(pluginName);
  if (pkg === null) return;
  const displayPackageName = `${pkg.name}@${pkg.maxVersion}`;
  const spinner = ora(`[${displayPackageName}] Installing...`);
  try {
    // 下载
    const { targetFile } = await download(pkg.tarball, displayPackageName);
    spinner.start();
    // 解压
    const { unpackDir, localPackage } = await unPack(targetFile, pkg.name);
    // 安装依赖
    await (await execaPromise).execa('pnpm',
      ['install', '--registry=https://registry.npmmirror.com/'], { cwd: unpackDir });
    spinner.succeed(`[${chalk.magenta(displayPackageName)}] Installation successful!`)
    // 注册插件
    PluginManager.getInstance().register({
      homepage: localPackage.homepage,
      name: localPackage.name,
      version: localPackage.version,
      description: localPackage.description,
      path: unpackDir
    })
  } catch (error) {
    spinner.stop();
    log.error(error)
  }
}

export default {
  add
};


