import { Model, SchemaTypes } from 'mongoose';

import { UserDoc } from '@app/user/types/user.doc';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserInfo } from '../user/types/user-info';
import { IMessage, IMessageDoc, ISearchMessageParams } from './types/message.interface';
import { Message } from './types/message.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDoc>,
    @InjectModel('Message') private readonly messageModel: Model<IMessageDoc>,
  ) {}
  async getMessages({ from, to, type }: ISearchMessageParams) {
    const range = [from.id, to.id];
    const [fromID, toID] = range;
    const msgs = await this.messageModel.find({ type, from: { $in: range }, to: { $in: range } }).exec();
    if (msgs.length > 0) {
      const user = {
        [fromID]: new UserInfo(await this.userModel.findById(fromID).exec()),
        [toID]: new UserInfo(await this.userModel.findById(toID).exec()),
      };
      return msgs.map(msg => {
        return new Message(msg, user[msg.from]);
      });
    }
  }
  async saveMessages(msg: IMessage) {
    const createMSG = new this.messageModel({ ...msg });
    const msgDoc = await createMSG.save();
    return new Message(msgDoc, new UserInfo(await this.userModel.findById(msg.from).exec()), msg.token);
  }
}
