import download from 'download-git-repo';
import cwd from '../utils/cwd';

function create(name, repo) {
  // const os = require('os');
  // const tmpdir = path.join(os.tmpdir(), 'door-cli', name);

  return new Promise((resolve, reject) => {
    download(repo, cwd.get(), { clone: true }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve('');
    });
  });
}

export {
  create,
};
