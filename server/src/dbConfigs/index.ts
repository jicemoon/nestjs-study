import { UserSchema } from './user/user.schema';
import { MessageSchema } from './message/message.schema';
import { UploadFileSchema } from './uploadFile/upload-file.schema';
import { COLLECTIONS_NAME } from './consts';

/**
 * Module中 MongooseModule的相关配置 - 用户
 */
export const DBCONFIG_USER = { name: COLLECTIONS_NAME.user, schema: UserSchema };
/**
 * Module中 MongooseModule的相关配置 - 所上传的文件
 */
export const DBCONFIG_MESSAGE = { name: COLLECTIONS_NAME.message, schema: MessageSchema };
/**
 * Module中 MongooseModule的相关配置 - 聊天记录
 */
export const DBCONFIG_UPLOADFILE = { name: COLLECTIONS_NAME.uploadFile, schema: UploadFileSchema };
// export const DB_MONGOOSE_CONFIGS = {
//   user: DBCONFIG_USER,
//   message: DBCONFIG_MESSAGE,
//   uploadFile: DBCONFIG_UPLOADFILE,
// };
