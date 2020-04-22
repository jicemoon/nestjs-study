import { UploadFileService } from './upload-file.service';
import { uploadImageFiles } from '@app/shared/utils';
import { UploadFile } from './types/upload-file.model';
import { IUploadFileDoc } from './types/upload-file.interface';
import { Model, SchemaTypes, Types } from 'mongoose';

import { UserDoc } from '@app/user/types/user.doc';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserInfo } from '../user/types/user-info';
import { IMessageDoc, ISearchMessageParams, IMessageFile, IMessage } from './types/message.interface';
import { Message } from './types/message.model';
import { MessageType } from './types/mssage-type.enum';
import { FileTypeKeys } from '@app/configs';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
    @InjectModel('Message') private readonly messageModel: Model<IMessageDoc>,
    private readonly uploadFileService: UploadFileService,
  ) {}
  async getMessages({ from, to, type }: ISearchMessageParams): Promise<Message[]> {
    const range = [from, to];
    const findParams: any = { type };
    switch (type) {
      case MessageType.personal:
        findParams.from = { $in: range };
        findParams.to = { $in: range };
        break;
      case MessageType.group:
        findParams.to = to;
        break;
    }
    const msgs = (await this.messageModel.find(findParams).exec()) || [];
    if (msgs.length > 0) {
      const user = {
        [from]: new UserInfo(await this.userModel.findById(from).exec()),
        [to]: new UserInfo(await this.userModel.findById(to).exec()),
      };
      const rtns = [];
      for (let i = 0, lens = msgs.length; i < lens; i++) {
        const msg = msgs[i];
        const message = new Message(msg, user[msg.from]);
        message.files = await this.uploadFileService.getUploadFileByIDs(msg.files);
        rtns.push(message);
      }
      return rtns;
    }
  }
  async saveMessages(msg: IMessageFile): Promise<Message> {
    const { files } = msg;
    const uploadFiles: UploadFile[] = [];
    if (files && files.length > 0) {
      for (let i = 0, lens = files.length; i < lens; i++) {
        uploadFiles.push(await this.uploadFileService.saveUploadFile(files[i]));
      }
    }
    const createMSG = new this.messageModel({ ...msg, files: uploadFiles.map(f => Types.ObjectId(f.id)) });
    const msgDoc = await createMSG.save();
    // , new UserInfo(await this.userModel.findById(msg.from).exec())
    const rtn = new Message(msgDoc, null, msg.token);
    rtn.files = uploadFiles;
    return rtn;
  }
}
