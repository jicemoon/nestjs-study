import { LoginUserDto } from './types/login-user.dto';
import { User } from './../user/types/user.doc';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtPayload } from './types/jwt-payload.interface';
import { UserInfo } from '../user/types/user-info';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: JwtPayload): Promise<UserInfo> {
    return this.usersService.getUserByID(payload.email);
  }
  async login(dto: LoginUserDto): Promise<UserInfo> {
    const user = await this.usersService.login(dto);
    const token = await this.createToken({ email: user.email });
    const userInfo = UserInfo.clone(user, false);
    userInfo.token = token;
    return userInfo;
  }
}
