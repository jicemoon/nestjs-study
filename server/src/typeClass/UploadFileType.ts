export class UploadFileType {
  /** 表单中指定的字段名称 */
  fieldname: string;
  /** 用户计算机中的文件名称(包含扩展名) */
  originalname: string;
  /** 文件编码类型 */
  encoding: string;
  /** 文件MIME 类型 */
  mimetype: string;
  /** 文件大小(字节为单位) */
  size: number;
  /** 文件字节流 */
  buffer: Buffer;
}
