import { writeFile, existsSync, mkdir } from 'promise-fs';
import { createHash } from 'crypto';
// import probe from 'probe-image-size';
import { imageSize } from 'image-size';
import { FileTypeKeys, UPLOAD_FOLDER } from '@app/configs';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { FileInfo } from '@app/user/types/fileinfo';
import { parse } from 'path';
import { ISizeCalculationResult } from 'image-size/dist/types/interface';

export function sha256(data) {
  return createHash('sha256')
    .update(data)
    .digest('hex');
}
/**
 * 保存需要上传的图片
 * @export
 * @param {UploadFileType} file 需要保存的图片
 * @param {FileTypeKeys} mineType 保存的目标路径子文件夹
 * @returns {Promise<FileInfo>} 保存后的文件路径信息
 */
export async function uploadImageFiles(file: UploadFileType, mineType: FileTypeKeys): Promise<FileInfo> {
  const { ext, name, base } = parse(file.originalname || '');
  const filePath = `${UPLOAD_FOLDER.images}/${mineType}`;
  const fullPath = `${UPLOAD_FOLDER.root}/${filePath}`;
  let fileName = sha256(base) + ext;
  let fullFilePath = `${fullPath}/${fileName}`;
  if (!existsSync(fullPath)) {
    await mkdir(fullPath, { recursive: true });
  }
  for (let i = 0; i < 20 && existsSync(fullFilePath); i++) {
    const random = Math.floor((100000 + i * 10000) * Math.random());
    let fillChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    if (Math.random() >= 0.5) {
      fillChar = fillChar.toLowerCase();
    }
    fileName = sha256(`${name}${('' + random).padStart(6, fillChar)}${ext}`) + ext;
    fullFilePath = `${fullPath}/${fileName}`;
  }
  await writeFile(fullFilePath, file.buffer);
  return new FileInfo(`${filePath}/${fileName}`);
}
export function getImageSize(input: string | Buffer): Promise<ISizeCalculationResult> {
  return new Promise<ISizeCalculationResult>((res, rej) => {
    if (typeof input === 'string') {
      imageSize(input, (err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    } else {
      res(imageSize(input));
    }
  });
}
export function getPersonalRoomID(from: string, to: string) {
  return [from, to].sort((a, b) => (a > b ? 1 : -1)).join('_');
}
