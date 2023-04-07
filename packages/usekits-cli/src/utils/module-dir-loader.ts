import fs from 'fs';
import path from 'path';

interface Modules {
  [key: string]: any;
}

function loadModules(dir: string): Modules {
  const modules: Modules = {};
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && file !== 'node_modules') {
      const indexFile = path.join(fullPath, 'index.js');
      if (fs.existsSync(indexFile)) {
        modules[file] = require(indexFile);
      } else {
        console.warn(`Skipping directory ${fullPath} - no index.js file found`);
      }
    } else if (stat.isFile() && path.extname(file) === '.js' && file !== 'index.js') {
      const moduleName = path.basename(file, '.js');
      modules[moduleName] = require(fullPath);
    }
  });

  return modules;
}

export default loadModules;