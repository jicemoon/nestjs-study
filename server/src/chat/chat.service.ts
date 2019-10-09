import { Model, SchemaTypes } from 'mongoose';

import { UserDoc } from '@app/user/types/user.doc';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserInfo } from '../user/types/user-info';
import { IMessage, IMessageDoc, ISearchMessageParams } from './types/message.interface';
import { Message } from './types/message.model';
import { MessageType } from './types/mssage-type.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
    @InjectModel('Message') private readonly messageModel: Model<IMessageDoc>,
  ) {}
  async getMessages({ from, to, type }: ISearchMessageParams) {
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
      return msgs.map(msg => {
        return new Message(msg, user[msg.from]);
      });
    }
  }
  async saveMessages(msg: IMessage) {
    const createMSG = new this.messageModel({ ...msg });
    const msgDoc = await createMSG.save();
    // , new UserInfo(await this.userModel.findById(msg.from).exec())
    return new Message(msgDoc, null, msg.token);
  }
}
