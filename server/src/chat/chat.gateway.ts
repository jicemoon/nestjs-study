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
import { CHAT_TYPES } from './types/chat-type.enum';
import { IMessage, ISearchMessageParams } from './types/message.interface';
import { MessageType } from './types/mssage-type.enum';
import { IOnlineUsersCache } from './types/online-user-cache.interface';

@WebSocketGateway(3628, { serveClient: false })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChagGateway');
  private readonly onlineUsersCache: IOnlineUsersCache = {};

  constructor(private chatService: ChatService) {}
  @WebSocketServer() server: Server;

  /**
   * 用户上线
   */
  @SubscribeMessage(CHAT_TYPES.loginUser)
  loginUser(client: Socket, payload: UserInfo) {
    const { id } = payload;
    this.onlineUsersCache[id] = {
      loginTime: new Date(),
      socket: client,
      userInfo: payload,
    };
    this.server.emit(CHAT_TYPES.onlineNotice, payload);
    return {
      event: CHAT_TYPES.loginUser,
      data: { onlineUserIDs: Object.values(this.onlineUsersCache).map(cache => cache.userInfo.id) },
    };
  }
  /**
   * 打开私聊窗口
   */
  @SubscribeMessage(CHAT_TYPES.openPersonalWindow)
  async openPersonalWindow(client: Socket, payload: ISearchMessageParams) {
    const { from: fromID, to: toID } = payload;
    payload.type = MessageType.personal;
    const msgs = await this.chatService.getMessages(payload);
    this.logger.log(`${fromID} <==> ${toID}`, '[SubscribeMessage openPersonalWindow]');
    return { event: CHAT_TYPES.initPersonalLog, data: { roomID: toID, msgs: msgs || [] } };
  }
  /**
   * 接收到私聊消息
   */
  @SubscribeMessage(CHAT_TYPES.personalMsgToServer)
  async handlePersonalMessage(client: Socket, payload: IMessage) {
    payload.type = MessageType.personal;
    const { from: fromID, to: toID } = payload;
    const msg = await this.chatService.saveMessages(payload);
    const toUserClient = this.onlineUsersCache[toID];
    if (toUserClient) {
      msg.userInfo = toUserClient.userInfo;
      toUserClient.socket.emit(CHAT_TYPES.personalMsgToClient, msg);
    }
    msg.userInfo = this.onlineUsersCache[fromID].userInfo;
    return { event: CHAT_TYPES.personalMsgToClient, data: msg };
  }

  afterInit(server: any) {
    this.logger.log('Socket.io 初始化完成');
  }
  handleConnection(client: any, ...args: any[]) {
    this.logger.log('Socket.io 连接成功.');
  }
  handleDisconnect(client: any) {
    this.logger.log('Socket.io 取消连接.');
    const keys = Object.keys(this.onlineUsersCache);
    keys.some(key => {
      const { userInfo, socket } = this.onlineUsersCache[key];
      const b = socket.id === client.id;
      if (b) {
        delete this.onlineUsersCache[key];
        this.server.emit(CHAT_TYPES.offlineNotice, userInfo);
      }
      return b;
    });
  }
}
