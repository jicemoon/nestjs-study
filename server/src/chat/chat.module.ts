import { UploadFileSchema } from './types/message.schema';
import { MessageSchema } from '@app/chat/types/message.schema';
import { UserSchema } from '@app/user/types/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UploadFileService } from './upload-file.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'UploadFile', schema: UploadFileSchema },
    ]),
  ],
  providers: [ChatGateway, ChatService, UploadFileService],
})
export class ChatModule {}
