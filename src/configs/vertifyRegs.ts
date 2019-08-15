/**
 * email正则验证
 */
export const EmailReg =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;

export const PasswordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/;
export const NameReg = /^(\d*\w+\d*)*$/;
