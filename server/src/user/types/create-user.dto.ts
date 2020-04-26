import { Types } from 'mongoose';
import { BaseUser } from '../../dbConfigs/user/user.doc';

/**
 * 新建账户
 * @export
 * @class CreateUserDto
 */
export class CreateUserDto implements BaseUser {
  name?: string;
  email: string;
  password: string;
  avatar?: Types.ObjectId;
}
