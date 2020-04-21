import { createReadStream, existsSync } from 'fs';
import { createServer } from 'http';
import { extname, resolve } from 'path';

import { STATIC_PORT } from './const.define';

interface IMineTypeMap {
  [key: string]: string;
}
const rootPath = resolve(__dirname, '../');
const server = createServer(function (req, res) {
  const fileName = resolve(rootPath, '.' + req.url);
  const extName = extname(fileName).substr(1);

  if (existsSync(fileName)) {
    //判断本地文件是否存在
    const mineTypeMap: IMineTypeMap = {
      html: 'text/html;charset=utf-8',
      htm: 'text/html;charset=utf-8',
      xml: 'text/xml;charset=utf-8',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      gif: 'image/gif',
      css: 'text/css;charset=utf-8',
      txt: 'text/plain;charset=utf-8',
      mp3: 'audio/mpeg',
      mp4: 'video/mp4',
      ico: 'image/x-icon',
      tif: 'image/tiff',
      svg: 'image/svg+xml',
      zip: 'application/zip',
      ttf: 'font/ttf',
      woff: 'font/woff',
      woff2: 'font/woff2',
    };
    if (mineTypeMap[extName]) {
      console.log('获取静态文件 => ', req.url);
      res.setHeader('Content-Type', mineTypeMap[extName]);
      var stream = createReadStream(fileName);
      stream.pipe(res);
    } else {
      console.log('找不到文件   => ', req.url);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.write('404 Not found');
      res.end();
    }
  }
});
server.listen(STATIC_PORT, () => {
  console.log('静态资源服务器启动', `http://localhost:${STATIC_PORT}`);
});
