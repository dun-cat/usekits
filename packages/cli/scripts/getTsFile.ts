import * as path from 'path';
import * as fs from 'fs';

/**
 * 获取指定目录中一级子目录中的 index.ts 文件全路径以及指定目录当前目录的 ts 文件路径
 * @param dir 目录路径
 * @returns {string[]} index.ts 文件路径以及 ts 文件路径数组
 */
export function getTsFiles(dir: string): string[] {
  const result: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory() && !file.name.startsWith('.')) {
      // 如果是一级子目录且不是隐藏文件夹，则查找其下的 index.ts 文件
      const indexFilePath = path.join(filePath, 'index.ts');
      if (fs.existsSync(indexFilePath)) {
        result.push(indexFilePath);
      }
    } else if (file.name.endsWith('.ts')) {
      // 如果是 ts 文件，则将其路径添加到结果数组中
      result.push(filePath);
    }
  }

  return result;
}