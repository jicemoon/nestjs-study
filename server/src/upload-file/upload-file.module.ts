import { DBCONFIG_UPLOADFILE } from './../dbConfigs/index';
import { Module, Global } from '@nestjs/common';
import { UploadFileService } from '@app/upload-file/upload-file.service';
import { MongooseModule } from '@nestjs/mongoose';
@Global()
@Module({
  imports: [MongooseModule.forFeature([DBCONFIG_UPLOADFILE])],
  providers: [UploadFileService],
  exports: [UploadFileService],
})
export class UploadFileModule {}
