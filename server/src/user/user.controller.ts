import { Request } from 'express';
import { writeFile } from 'promise-fs';

import { sha256 } from '@app/shared/utils';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UPLOAD_FOLDER } from '../configs/const.define';
import {
  PageParamsDto,
  ResponseDecorator,
  ResponseErrorEvent,
  ResponseErrorType,
  ResponsePagingJSON,
} from '../typeClass/response/index';
import { CreateUserDto } from './types/create-user.dto';
import { FileInfo } from './types/fileinfo';
import { ModifyPasswordDto } from './types/modify-password.dto';
import { UpdateUserDto } from './types/update-user.dto';
import { UserInfo } from './types/user-info';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('uploadAvatar')
  // @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ResponseDecorator<string>('上传成功')
  public async uploadAvatar(@UploadedFile() file: any): Promise<FileInfo> {
    const names: string[] = ((file.originalname || '') as string).split('.');
    const ext = names.pop();
    const fileName = sha256(names.join('.') || '');
    const filePath = `${UPLOAD_FOLDER.images}/${UPLOAD_FOLDER.avatar}/${fileName}.${ext}`;
    try {
      await writeFile(`${UPLOAD_FOLDER.root}/${filePath}`, file.buffer);
      return Promise.resolve(new FileInfo(filePath));
    } catch (e) {
      throw new ResponseErrorEvent(ResponseErrorType.unknown, '上传失败');
    }
  }
  @Post()
  @ResponseDecorator<UserInfo>('成功创建用户')
  @UseInterceptors(FileInterceptor('avatar'))
  public create(@Req() req: Request, @Body() dto: CreateUserDto, @UploadedFile() file: any): Promise<UserInfo> {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseDecorator<UserInfo>('成功获取用户列表')
  public async findAll(
    @Body() pageParams: PageParamsDto,
    @Body('id') id: string,
  ): Promise<ResponsePagingJSON<UserInfo> | UserInfo[]> {
    if (id) {
      const user = await this.service.getUserByID(id);
      return [user];
    }
    return this.service.findAll(pageParams);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseDecorator<UserInfo>('成功获取用户信息')
  public getUserByID(@Param('id') id: string): Promise<UserInfo> {
    return this.service.getUserByID(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseDecorator<UserInfo>('成功更新用户信息')
  public updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string): Promise<UserInfo> {
    if (dto.password) {
      throw new ResponseErrorEvent(ResponseErrorType.unknown, '此接口不能用来修改密码');
    }
    return this.service.updateUser(id, dto);
  }

  @Put('modifyPassword/:id')
  @UseGuards(JwtAuthGuard)
  @ResponseDecorator<any>('修改密码成功')
  public modifyPassword(@Body() dto: ModifyPasswordDto, @Param('id') id: string): Promise<any> {
    return this.service.modifyPassword(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseDecorator<UserInfo>('成功删除用户')
  public deleteUser(@Param('id') id: string): Promise<UserInfo> {
    return this.service.deleteUser(id);
  }
}
