import { resolve } from 'path';

// const DB_USER = 'reese';
// const DB_PW = 'TE09bRkDM7tH1HAn';
// const DB_NAME = 'NestStudy';
// export const DB_URI: string = `mongodb+srv://${DB_USER}:${DB_PW}@cluster0-1elaz.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
export const DB_URI: string = 'mongodb://localhost:27017/NestHello';
export const SALT_ROUNTS: number = 15;
export const SECRET_KEY: string = 'eiujskdf@#$8*(sdkjfksadf';
export const EXPIRES_IN: number = 24 * 60 * 60;
export const STATIC_PORT: number = 8965;
export const UPLOAD_FOLDER = {
  uri: `http://localhost:${STATIC_PORT}/upload/`, // 静态图片服务器域名
  root: resolve(__dirname, '../../../temp/upload/'), // 文件上传路径
  images: 'images',
  avatar: 'avatar',
};
