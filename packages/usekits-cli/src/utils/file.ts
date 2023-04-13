import path from 'path';
import fs from 'fs';

function findPackageJson(filePath: string): string | null {
  let currentDir = path.dirname(filePath);
  while (true) {
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
    const parentDir = path.dirname(currentDir);
    if (currentDir === parentDir) {
      return null;
    }
    currentDir = parentDir;
  }
}

export {
  findPackageJson
}
