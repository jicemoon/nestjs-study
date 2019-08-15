import * as joi from 'joi';
import { CreateUserDto } from './types/create-user.dto';
import { PasswordReg, NameReg } from '../configs/vertifyRegs';
import { ResponseErrorEvent, ResponseErrorType } from '../typeClass/response';
import { UpdateUserDto } from './types/update-user.dto';
import { ModifyPasswordDto } from './types/modify-password.dto';

const name: joi.StringSchema = joi.string().min(3).max(200).regex(NameReg).label('当名字为空时, 去Email中的名字, 否则必须为3-200的字符串');
const email: joi.StringSchema = joi.string().required().email().label('您输入的Email地址格式不正确');
const password: joi.StringSchema = joi.string().min(6).max(20).regex(PasswordReg, 'password').label('密码不能为空, 长度必须大于6, 小于20, 且同时包括字母和数字');
export const CreateUserJOI = {
  name,
  email,
  password: password.required(),
};

export const UpdateUserJOI = {
  name,
  password,
};
export const ModifyPasswordJOI = {
  oldPassword: joi.string().required().label('旧密码不能为空'),
  newPassword: password.required(),
  rePassword: password.required(),
};
export function validateBase<T>(dto: T, joiSchema: { [key: string]: joi.AnySchema}) {
  const { error } = joi.validate(dto, joiSchema, { abortEarly: false });
  if (error) {
    const keys = [];
    let errMsgs: string[] = [];
    error.details.forEach(ve => {
      const { key, label } = ve.context;
      if (keys.indexOf(key) === -1) {
        errMsgs.push(label);
        keys.push(key);
      }
    });
    const errorType = ResponseErrorType.incorrectFormat;
    errMsgs = [...new Set(errMsgs)];
    const msg = errMsgs.length > 1 ? errMsgs : errMsgs[0];
    throw new ResponseErrorEvent(errorType, msg);
  }
}
/**
 * 创建新用户, 信息校验
 * @export
 * @param {CreateUserDto} dto
 * @returns
 */
export function validateCreateUser(dto: CreateUserDto) {
  return validateBase<CreateUserDto>(dto, CreateUserJOI);
}
/**
 * 修改用户信息, 信息校验
 * @param dto
 */
export function validateUpdateUser(dto: UpdateUserDto) {
  return validateBase<UpdateUserDto>(dto, UpdateUserJOI);
}
export function validateModifyPassword(dto: ModifyPasswordDto) {
  validateBase(dto, ModifyPasswordJOI);
  if (dto.newPassword !== dto.rePassword) {
    throw new ResponseErrorEvent(ResponseErrorType.userWrongRePassword);
  }
  if (dto.newPassword === dto.oldPassword) {
    throw new ResponseErrorEvent(ResponseErrorType.userSamePassword);
  }
}
