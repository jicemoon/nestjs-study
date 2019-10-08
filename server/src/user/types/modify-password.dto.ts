/**
 * 修改用户密码所需参数
 * @export
 * @class ModifyPasswordDto
 */
export class ModifyPasswordDto {
  /**
   * 旧密码
   * @type {string}
   * @memberof ModifyPasswordDto
   */
  oldPassword: string;
  /**
   * 新密码
   * @type {string}
   * @memberof ModifyPasswordDto
   */
  newPassword: string;
  /**
   * 重复密码
   * @type {string}
   * @memberof ModifyPasswordDto
   */
  rePassword: string;
}
