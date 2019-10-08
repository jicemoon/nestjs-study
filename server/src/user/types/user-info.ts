import { MyDate } from '../../extends/Date.extends';
import { FileInfo } from './fileinfo';
import { User, UserDoc } from './user.doc';

export class UserInfo implements User {
  id?: string;
  email: string;
  name?: string;
  token?: string;
  avatar?: string;
  createDateStr?: string;
  updateDateStr?: string;
  userDoc?: UserDoc;
  constructor(user?: UserDoc, needUserDoc: boolean = false) {
    if (user) {
      this.id = user._id.toString();
      this.email = user.email;
      this.name = user.name;
      this.createDateStr = new MyDate(user.createDate).format();
      this.updateDateStr = new MyDate(user.updateDate).format();
      if (needUserDoc) {
        this.userDoc = user;
      }
      if (user.avatar) {
        const fileInfo = new FileInfo(user.avatar);
        this.avatar = `${fileInfo.fileUri}/${fileInfo.filePath}`;
      }
    }
  }
  static clone(userInfo: UserInfo, needUserDoc: boolean = false) {
    const user = new UserInfo();
    Object.assign(user, userInfo);
    if (!needUserDoc && user.userDoc) {
      user.userDoc = undefined;
      delete user.userDoc;
    }
    return user;
  }
}