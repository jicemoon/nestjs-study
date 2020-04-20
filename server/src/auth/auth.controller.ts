import { Request, Response } from 'express';
import { ResponseDecorator } from '@app/typeClass/response';

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';

import { UserInfo } from '@app/user/types/user-info';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginUserDto } from './types/login-user.dto';

@Controller('')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Get('login')
  @ResponseDecorator<UserInfo>('登录成功')
  public login(@Body() dto: LoginUserDto): Promise<UserInfo> {
    return this.service.login(dto);
  }

  @Post('login')
  @ResponseDecorator<UserInfo>('登录成功')
  public loginPost(@Body() dto: LoginUserDto): Promise<UserInfo> {
    return this.service.login(dto);
  }

  @Get('getUserInfo')
  @UseGuards(JwtAuthGuard)
  @ResponseDecorator<UserInfo>('获取用户信息成功')
  public getUserInfoByToken(@Req() req: Request): UserInfo {
    return UserInfo.clone(req.user, false);
  }
}
