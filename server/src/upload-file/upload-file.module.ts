import { Module, Global } from '@nestjs/common';
import { UploadFileService } from '@app/upload-file/upload-file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadFileSchema } from '@app/chat/types/message.schema';
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: 'UploadFile', schema: UploadFileSchema }])],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
