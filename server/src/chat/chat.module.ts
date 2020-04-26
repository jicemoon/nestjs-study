import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DBCONFIG_USER, DBCONFIG_MESSAGE, DBCONFIG_UPLOADFILE } from '@app/dbConfigs/index';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [MongooseModule.forFeature([DBCONFIG_USER, DBCONFIG_MESSAGE, DBCONFIG_UPLOADFILE]), UserModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
