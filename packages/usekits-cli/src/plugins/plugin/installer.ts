import https from 'https';
import fs from 'fs';
import ProgressBar from 'progress';
import url from 'url';
import axios from 'axios';
type DownloadOptions = {
  url: string;
}

function download(fileUrl: string) {
  const parsedUrl = url.parse(fileUrl);

  const fileName = parsedUrl.pathname.split('/').pop();
  const file = fs.createWriteStream(fileName)
  axios(fileUrl, {
    method: 'GET',
    responseType: 'stream',
    maxRedirects: 3,
  }).then((res) => {
    const totalSize = parseInt(res.headers['content-length'] as string, 10);
    let downloadedSize = 0;
    const progressBar = new ProgressBar(`Downloading ${fileName} [:bar] :percent :etas`, {
      width: 40,
      complete: '=',
      incomplete: ' ',
      renderThrottle: 1,
      total: totalSize
    });

    res.data.on('data', (chunk: Buffer) => {
      downloadedSize += chunk.length;
      progressBar.tick(chunk.length);
    });

    res.data.on('end', () => {
      console.log(`\nDownloaded ${fileName}`);
      file.end(() => {
        console.log(`Download complete. File saved as ${fileName}`);
      });
    });
    res.data.pipe(file);
  });
}

const installer = {}

export {
  download
};


