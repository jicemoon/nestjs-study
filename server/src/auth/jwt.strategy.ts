import { ExtractJwt, Strategy } from 'passport-jwt';
import { ResponseErrorEvent, ResponseErrorType } from 'src/typeClass/response';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { SECRET_KEY } from '../configs';
import { AuthService } from './auth.service';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader('token'),
        ExtractJwt.fromBodyField('token'),
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      secretOrKey: SECRET_KEY,
    });
  }
  async validate(payload: JwtPayload) {
    const data = await this.authService.validateUser(payload);
    if (!data) {
      throw new ResponseErrorEvent(ResponseErrorType.unauthorized);
    }
    return data;
  }
}
