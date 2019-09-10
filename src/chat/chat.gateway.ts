import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

enum MsgType {
  default = 1,
}
interface IMsg {
  type: MsgType;
  msg: string;
}

@WebSocketGateway({ path: '/chat', serveClient: false })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChagGateway');

  @WebSocketServer() server: Server;

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: IMsg): WsResponse<IMsg> {
    // this.server.emit('msgToClient', payload);
    // client.emit('msgToClient', payload);
    return { event: 'msgToClient', data: payload };
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
