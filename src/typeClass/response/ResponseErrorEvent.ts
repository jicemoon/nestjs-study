export enum ResponseErrorType {
  /**
   * 没有错误, 默认值
   */
  no = 0,
  /**
   * 未知错误
   */
  unknown = 104,
  /**
   * 格式不正确
   */
  incorrectFormat = 300,
  /**
   * 要创建的用户已经存在
   */
  userExist = 1001,
  /**
   * 要查找或者更新的用户不存在
   */
  userNoExist = 1000,
  /**
   * 密码错误
   */
  userWrongPassword = 1002,
  /**
   * 修改密码时, 两次密码输入不同
   */
  userWrongRePassword = 1003,
  /**
   * 修改密码时, 旧密码和新密码相同
   */
  userSamePassword = 1004,
  /**
   * 更新Email信息错误[Email信息创建后, 不能修改]
   */
  updateEmailError = 2000,
  /**
   * 没有权限
   */
  unauthorized = 401,
  /**
   * token已过期
   */
  authorizedExpiresDate = 402,
}
export const ResponseErrorMsg: { [key: number]: string } = {
  0: '',
  401: '您没有此权限',
  402: '您的权限已过期, 请重新登录',
  1001: '已经存在用户',
  1000: '不存在用户',
  1002: '您输入的密码不正确',
  1003: '两次输入密码不相同, 请重新输入',
  1004: '新密码不能和旧密码相同, 请重新输入',
  2000: '不能更新邮箱地址',
};

export class ResponseErrorEvent extends Error {
  public error: ResponseErrorType;
  public msg: string | string[];
  constructor(error: ResponseErrorType, msg?: string | string[]) {
    const errorMsg = msg || ResponseErrorMsg[error];
    super(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
    this.error = error;
    this.msg = errorMsg;
  }
}
