import { compare, hash } from 'bcrypt';
import { Model, Types } from 'mongoose';

import { Injectable, Global } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { LoginUserDto } from '@app/auth/types/login-user.dto';
import { SALT_ROUNTS } from '@app/configs';
import { FileTypeKeys } from '@app/configs/const.define';
import {
  IPageData,
  PageParamsDto,
  ResponseErrorEvent,
  ResponseErrorMsg,
  ResponseErrorType,
  ResponsePagingJSON,
} from '../typeClass/response';
import { CreateUserDto } from './types/create-user.dto';
import { ModifyPasswordDto } from './types/modify-password.dto';
import { UpdateUserDto } from './types/update-user.dto';
import { UserInfo } from './types/user-info';
import { UserDoc } from './types/user.doc';
import { validateCreateUser, validateModifyPassword, validateUpdateUser } from './user.validate';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { UploadFileService } from '@app/upload-file/upload-file.service';
import { UploadFile } from '@app/upload-file/types/upload-file.model';

@Global()
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
    private readonly uploadFileService: UploadFileService,
  ) {}
  /**
   * 创建新用户
   * @param {CreateUserDto} createUrserDto 要创建的用户信息
   * @returns {Promise<User>}
   * @memberof UserService
   */
  public async create(createUrserDto: CreateUserDto, avatar: UploadFileType): Promise<UserInfo> {
    validateCreateUser(createUrserDto);
    const old = await this.userModel.findOne({ email: createUrserDto.email });
    if (old) {
      const hasErrorType = ResponseErrorType.userExist;
      const hasErrorMsg = `${ResponseErrorMsg[hasErrorType]} ${createUrserDto.email} `;
      throw new ResponseErrorEvent(hasErrorType, hasErrorMsg);
    }
    if (!createUrserDto.name) {
      createUrserDto.name = createUrserDto.email.split('@')[0];
    }
    const password = createUrserDto.password;
    const hashPW = await hash(password, SALT_ROUNTS);
    createUrserDto.password = hashPW;
    let fileInfo: UploadFile;
    try {
      // const avatarFileInfo = await uploadImageFiles(avatar, FileTypeKeys.avatar);
      fileInfo = await this.uploadFileService.saveUploadFile(avatar, FileTypeKeys.avatar);
      createUrserDto.avatar = Types.ObjectId(fileInfo.id);
    } catch (e) {
      throw new ResponseErrorEvent(ResponseErrorType.unknown, '上传失败');
    }
    const createdUser = new this.userModel({ ...createUrserDto });
    const user = await createdUser.save();
    if (!user) {
      throw new ResponseErrorEvent(ResponseErrorType.unknown, '新建用户失败');
    }
    const rtn = new UserInfo(user);
    rtn.avatar = fileInfo.uri;
    return rtn;
  }
  // public async saveAvatar(avatar: UploadFileType): Promise<UploadFile> {
  //   const file = await this.uploadFileService.saveUploadFile(avatar, FileTypeKeys.avatar);
  //   return
  // }
  /**
   * 查找所有用户
   * @returns {Promise<User[]>}
   * @memberof UserService
   */
  public async findAll(pageParams: PageParamsDto): Promise<ResponsePagingJSON<UserInfo> | UserInfo[]> {
    const query = this.userModel
      .find()
      .select('-__v -password')
      .populate('avatar');
    let users: UserDoc[];
    let pageData: IPageData;
    if (pageParams && (pageParams.pageIndex || pageParams.pageSize)) {
      const count = await this.userModel.count(query);
      let { pageIndex, pageSize } = pageParams;
      pageIndex = pageIndex || 1;
      pageSize = pageSize || 20;
      users = await query
        .skip(pageSize * (pageIndex - 1))
        .limit(pageSize)
        .populate('avatar', 'uri')
        .exec();
      pageData = {
        pageSize,
        pageIndex,
        total: count,
        isEnd: users.length < pageSize || count / pageSize === pageIndex,
      };
      return new ResponsePagingJSON<UserInfo>(pageData, users.map(user => new UserInfo(user)));
    } else {
      users = await query.exec();
      return users.map(user => new UserInfo(user));
    }
  }
  /**
   * 根据ID或者email地址获取用户
   *
   * @param {string} id 要查找的用户ID或email地址
   * @returns {Promise<User>}
   * @memberof UserService
   */
  public async getUserByID(id: string, needUserDoc: boolean = false): Promise<UserInfo> {
    let user: UserDoc;
    if (/@/.test('' + id)) {
      user = await this.userModel.findOne({ email: id }).populate('avatar', 'uri');
    } else {
      user = await this.userModel.findById(id).populate('avatar', 'uri');
    }
    if (!user) {
      const error = ResponseErrorType.userNoExist;
      const msg = `${ResponseErrorMsg[error]} ${id} `;
      throw new ResponseErrorEvent(error, msg);
    }
    return new UserInfo(user, needUserDoc);
  }
  /**
   * 更新用户信息, 不能更新Email地址
   *
   * @param {string} id 要更新的用户ID或email地址
   * @param {CreateUserDto} dto 要更新的数据
   * @returns {Promise<User>}
   * @memberof UserService
   */
  public async updateUser(id: string, dto: UpdateUserDto): Promise<UserInfo> {
    if ((dto as any).email) {
      throw new ResponseErrorEvent(ResponseErrorType.updateEmailError);
    }
    validateUpdateUser(dto);
    dto.updateDate = new Date();
    if (dto.password) {
      dto.password = await hash(dto.password, SALT_ROUNTS);
    }
    let user: UserDoc;
    if (/@/.test('' + id)) {
      user = await this.userModel
        .findOneAndUpdate({ email: id }, { $set: dto }, { new: true })
        .select('-__v -password');
    } else {
      user = await this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).select('-__v -password');
    }
    if (!user) {
      const error = ResponseErrorType.userNoExist;
      const msg = `${ResponseErrorMsg[error]} ${id} `;
      throw new ResponseErrorEvent(error, msg);
    }
    return new UserInfo(user);
  }
  /**
   * 修改密码
   * @param id 要修改密码的用户id
   * @param dto
   */
  public async modifyPassword(id: string, dto: ModifyPasswordDto): Promise<UserInfo> {
    validateModifyPassword(dto);
    const user: UserInfo = await this.getUserByID(id, true);
    const isSame = await compare(dto.oldPassword, user.userDoc.password);
    if (!isSame) {
      throw new ResponseErrorEvent(ResponseErrorType.userWrongPassword);
    }
    return this.updateUser(id, { password: dto.newPassword });
  }
  /**
   * 根据id或者Email删除用户
   *
   * @param {string} id 要删除的用户ID或email地址
   * @returns {Promise<User>}
   * @memberof UserService
   */
  public async deleteUser(id: string): Promise<UserInfo> {
    let user: UserDoc;
    if (/@/.test('' + id)) {
      user = await this.userModel.findOneAndDelete({ email: id }).select('-__v -password');
    } else {
      user = await this.userModel.findByIdAndDelete(id).select('-__v -password');
    }
    if (!user) {
      const error = ResponseErrorType.userNoExist;
      const msg = `${ResponseErrorMsg[error]} ${id} `;
      throw new ResponseErrorEvent(error, msg);
    }
    return new UserInfo(user);
  }
  public async login({ email, password }: LoginUserDto): Promise<UserInfo> {
    const user: UserInfo = await this.getUserByID(email, true); // .userModel.findOne({ email });
    const isSame = await compare(password, user.userDoc.password);
    if (!isSame) {
      throw new ResponseErrorEvent(ResponseErrorType.userWrongPassword);
    }
    return user;
  }
}
