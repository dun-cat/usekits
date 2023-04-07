const cwd = process.cwd();
import { readdirSync } from 'fs-extra';

function isEmpty(dir) {
  const result = readdirSync(dir);
  return result.length === 0;
}

export default {
  get: () => cwd,
  isEmpty,
};
