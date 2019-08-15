import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './types/user.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature(([
      { name: 'User', schema: UserSchema},
    ])),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [
    UserService,
  ],
})
export class UserModule {}
