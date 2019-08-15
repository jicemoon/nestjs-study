import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseData, ResponseErrorType, ResponseErrorMsg } from '../../typeClass/response';
// import { Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  public handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // const res = context.switchToHttp().getResponse() as Response;
    const resData = new ResponseData();
    const error = ResponseErrorMsg[ResponseErrorType.unauthorized];
    resData.status = false;
    if (err) {
      resData.statusCode = err.error;
      resData.message = err.msg || err.message;
      throw new UnauthorizedException(resData.message, error);
    } else if (!user) {
      resData.statusCode = ResponseErrorType.unauthorized;
      resData.message = ResponseErrorMsg[resData.statusCode];
      throw new UnauthorizedException(resData.message, error);
    } else {
      return user;
    }
  }
}
