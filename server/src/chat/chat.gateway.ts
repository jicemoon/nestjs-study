import { from } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { getPersonalRoomID } from '@app/shared/utils';
import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway,
    WebSocketServer, WsResponse
} from '@nestjs/websockets';

import { UserInfo } from '../user/types/user-info';
import { ChatService } from './chat.service';
import { IMessage, ISearchMessageParams } from './types/message.interface';
import { MessageType } from './types/mssage-type.enum';

@WebSocketGateway(3628, { serveClient: false })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChagGateway');
  private readonly clientSockets: { [key: string]: Socket } = {};

  constructor(private chatService: ChatService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('login')
  async loginMessage(client: Socket, payload: ISearchMessageParams) {
    const {
      from: { id: fromID },
      to: { id: toID },
      type,
    } = payload;
    // this.clientSockets[payload.from.id] = client;
    this.logger.log(payload, '[SubscribeMessage LOGIN]');
    const msgs = await this.chatService.getMessages(payload);
    let roomID: string;
    switch (type) {
      case MessageType.personal:
        roomID = getPersonalRoomID(fromID, toID);
        break;
      default:
        roomID = toID;
        break;
    }
    client.join(roomID);
    client.emit('login', { roomID, user: from, msgs });
    this.server.to(roomID).emit('onlineUser', { roomID, user: payload.from });
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: IMessage) {
    const { type, from: fromID, to: toID } = payload;
    const msg = await this.chatService.saveMessages(payload);
    let roomID: string;
    switch (type) {
      case MessageType.personal:
        roomID = getPersonalRoomID(fromID, toID);
        break;
      default:
        roomID = toID;
        break;
    }
    this.server.to(roomID).emit(roomID, msg || []);
  }

  afterInit(server: any) {
    this.logger.log('Socket.io 初始化完成');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log('Socket.io 连接成功.');
  }
  handleDisconnect(client: any) {
    this.logger.log('Socket.io 取消连接.');
  }
}
