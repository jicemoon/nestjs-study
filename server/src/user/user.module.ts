import { DBCONFIG_USER, DBCONFIG_UPLOADFILE } from '@app/dbConfigs/index';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { EXPIRES_IN, SECRET_KEY } from '@app/configs';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([DBCONFIG_USER, DBCONFIG_UPLOADFILE]),
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: {
        expiresIn: `${EXPIRES_IN}s`,
      },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
