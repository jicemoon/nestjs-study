import { resolve } from 'path';
import { copyFileSync } from 'fs-extra';

const sourceFile = resolve(
  __dirname,
  '../../server/src/configs/const.define.ts',
);
const targeFile = resolve(__dirname, '../const.define.ts');

copyFileSync(sourceFile, targeFile);
