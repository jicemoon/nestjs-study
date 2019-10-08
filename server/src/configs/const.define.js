"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.DB_URI = 'mongodb://localhost:27017/NestHello';
const DB_USER = 'reese';
const DB_PW = 'TE09bRkDM7tH1HAn';
const DB_NAME = 'NestStudy';
exports.SALT_ROUNTS = 15;
exports.SECRET_KEY = 'eiujskdf@#$8*(sdkjfksadf';
exports.EXPIRES_IN = 24 * 60 * 60;
exports.STATIC_PORT = 8965;
exports.UPLOAD_FOLDER = {
    uri: `http://localhost:${exports.STATIC_PORT}/upload/`,
    root: path_1.resolve(__dirname, '../../../temp/upload/'),
    images: 'images',
};
//# sourceMappingURL=const.define.js.map