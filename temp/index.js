"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const http_1 = require("http");
const path_1 = require("path");
const const_define_1 = require("../server/src/configs/const.define");
const rootPath = path_1.resolve(__dirname, './');
const server = http_1.createServer(function (req, res) {
    const fileName = path_1.resolve(rootPath, '.' + req.url);
    const extName = path_1.extname(fileName).substr(1);
    if (fs_1.existsSync(fileName)) {
        //判断本地文件是否存在
        const mineTypeMap = {
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
            var stream = fs_1.createReadStream(fileName);
            stream.pipe(res);
        }
        else {
            console.log('找不到文件   => ', req.url);
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('404 Not found');
            res.end();
        }
    }
});
server.listen(const_define_1.STATIC_PORT, () => {
    console.log('静态资源服务器启动', `http://localhost:${const_define_1.STATIC_PORT}`);
});
//# sourceMappingURL=index.js.map