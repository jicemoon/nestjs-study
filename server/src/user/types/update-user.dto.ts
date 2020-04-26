import { BaseUser } from '../../dbConfigs/user/user.doc';

/**
 * 更新用户信息账户
 * @export
 * @class UpdateUserDto
 */
export class UpdateUserDto implements BaseUser {
  name?: string;
  password?: string;
  updateDate?: Date;
}
