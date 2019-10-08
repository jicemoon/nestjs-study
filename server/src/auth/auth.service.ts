import { ResponseErrorType } from 'src/typeClass/response';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EXPIRES_IN } from '../configs/const.define';
import { ResponseErrorEvent } from '../typeClass/response/ResponseErrorEvent';
import { UserInfo } from '../user/types/user-info';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/jwt-payload.interface';
import { LoginUserDto } from './types/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService, private readonly jwtService: JwtService) {}

  async createToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<UserInfo> {
    if (payload.expiresDate < Date.now()) {
      throw new ResponseErrorEvent(ResponseErrorType.authorizedExpiresDate);
    }
    return this.usersService.getUserByID(payload.email);
  }
  async login(dto: LoginUserDto): Promise<UserInfo> {
    const user = await this.usersService.login(dto);
    const token = await this.createToken({ email: user.email, expiresDate: Date.now() + EXPIRES_IN * 1000 });
    const userInfo = UserInfo.clone(user, false);
    userInfo.token = token;
    return userInfo;
  }
}
