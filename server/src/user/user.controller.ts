import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PageParamsDto,
  ResponseDecorator,
  ResponseErrorEvent,
  ResponseErrorType,
  ResponsePagingJSON,
} from '../typeClass/response/index';
import { CreateUserDto } from './types/create-user.dto';
import { ModifyPasswordDto } from './types/modify-password.dto';
import { UpdateUserDto } from './types/update-user.dto';
import { UserInfo } from './types/user-info';
import { UserService } from './user.service';
import { UploadFileType } from '@app/typeClass/UploadFileType';
import { JwtPayload } from '@app/auth/types/jwt-payload.interface';
import { EXPIRES_IN } from '@app/configs';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService, private readonly jwtService: JwtService) {}

  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  @ResponseDecorator<UserInfo>('成功创建用户')
  public async create(@UploadedFile() avatar: UploadFileType, @Body() dto: CreateUserDto): Promise<UserInfo> {
    const user = await this.service.create(dto, avatar);
    const payload: JwtPayload = { email: user.email, expiresDate: Date.now() + EXPIRES_IN };
    user.token = this.jwtService.sign(payload);
    return user;
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
