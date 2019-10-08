import { Server, Socket } from 'socket.io';

import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway,
    WebSocketServer, WsResponse
} from '@nestjs/websockets';

import { UserInfo } from '../user/types/user-info';
import { ChatService } from './chat.service';
import { IMessage } from './types/message.interface';

@WebSocketGateway(3628, { serveClient: false })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChagGateway');
  private readonly clientSockets: { [key: string]: Socket } = {};

  constructor(private chatService: ChatService) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('login')
  async loginMessage(client: Socket, payload: { from: UserInfo; to: UserInfo }) {
    this.clientSockets[payload.from.id] = client;
    this.logger.log(payload, '[SubscribeMessage LOGIN]');
    const msgs = await this.chatService.getMessages(payload);
    // const {
    //   to: { id: toId },
    // } = payload;
    // if (this.clientSockets[toId]) {
    //   this.clientSockets[toId].emit('login', msgs);
    // }
    return { event: 'login', data: msgs };
  }

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: IMessage) {
    const msg = await this.chatService.saveMessages(payload);
    if (this.clientSockets[payload.to]) {
      this.clientSockets[payload.to].emit(payload.to, msg);
    }
    return { event: payload.to, data: msg };
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
