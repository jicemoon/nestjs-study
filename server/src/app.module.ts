import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { DB_URI } from './configs/const.define';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }),
    MulterModule.register({
      dest: '/temp/upload',
    }),
    AuthModule,
    UserModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
