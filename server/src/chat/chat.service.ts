import { UploadFileService } from '../upload-file/upload-file.service';
import { Model, Types } from 'mongoose';

import { UserDoc } from '@app/dbConfigs/user/user.doc';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { IMessageDoc, ISearchMessageParams, IMessageFile } from '../dbConfigs/message/message.doc';
import { Message } from './types/message.model';
import { MessageType } from './types/mssage-type.enum';
import { UploadFile } from '@app/upload-file/types/upload-file.model';
import { UserService } from '@app/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
    @InjectModel('Message') private readonly messageModel: Model<IMessageDoc>,
    private readonly uploadFileService: UploadFileService,
    private readonly userService: UserService,
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
        [from]: await this.userService.getUserByID(from),
        [to]: await this.userService.getUserByID(to),
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
