import { Controller, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './types/login-user.dto';
import { User } from '../user/types/user.doc';
import { ResponseDecorator } from 'src/typeClass/response';

@Controller('')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Get('login')
  @ResponseDecorator<User>('登录成功')
  login(@Body() dto: LoginUserDto): Promise<User> {
    return this.service.login(dto);
  }
}
