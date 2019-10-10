import { Socket } from 'ngx-socket-io';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CHAT_TYPES } from '@app/models/chat-type.enum';
import { IMsg, MsgItem } from '@app/models/message.interface';
import { IUserInfo } from '@app/models/userinfo.interface';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private currentUserID: string;
  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('reese', 'Socket Connected');
    });
  }
  loginUser(userInfo: IUserInfo) {
    this.currentUserID = userInfo.id;
    this.socket.emit(CHAT_TYPES.loginUser, userInfo);
  }
  /**
   * 用户登录成功后的推送
   */
  getLoginUser() {
    return this.getMessage<{ onlineUserIDs: string[] }>(CHAT_TYPES.loginUser);
  }
  /**
   * 用户上线通知
   * @param id 监听单个用户上线通知, 不传时, 监听所有的用户上线通知
   */
  getOnlineNotice(id?: string) {
    return this.getMessage<IUserInfo>(CHAT_TYPES.onlineNotice).pipe(
      filter(user => user.id !== this.currentUserID && (!id || user.id === id)),
    );
  }
  /**
   * 用户下线通知
   * @param id 监听单个用户下线通知, 不传时, 监听所有的用户下线通知
   */
  getOfflineNotice(id?: string) {
    return this.getMessage<IUserInfo>(CHAT_TYPES.offlineNotice).pipe(filter(user => !id || user.id === id));
  }

  sendPersonalMsg(msg: IMsg) {
    this.socket.emit(CHAT_TYPES.personalMsgToServer, msg);
  }
  getPersonalMsg(id?: string) {
    return this.getMessage<IMsg>(CHAT_TYPES.personalMsgToClient).pipe(
      filter(msg => {
        return !id || msg.from === id || (msg.from === this.currentUserID && msg.to === id);
      }),
    );
  }
  openPersonalWindow(id: string) {
    return this.sendMessage(CHAT_TYPES.openPersonalWindow, { from: this.currentUserID, to: id });
  }
  getInitPersonalLog(id?: string) {
    return this.getMessage<{ roomID: string; msgs: MsgItem[] }>(CHAT_TYPES.initPersonalLog).pipe(
      filter(json => !id || json.roomID === id),
    );
  }
  /* ======================================================= */
  // login(from: IUserInfo, to: IUserInfo, type: MessageType) {
  //   this.socket.emit(SocketEventType.login, { from, to, type });
  // }
  // loginMessage() {
  //   return this.socket.fromEvent<{ roomID: string; user: IUserInfo; msgs: MsgItem[] }>('login');
  // }
  getOnlineUser(roomID: string, userID: string) {
    return this.socket.fromEvent<{ roomID: string; user: IUserInfo }>('onlineUser').pipe(
      filter(json => json.roomID === roomID && json.user.id !== userID),
      map(json => json.user),
    );
  }
  sendMessage(type: CHAT_TYPES, msg: any) {
    this.socket.emit(type, msg);
  }
  getMessage<T>(type: CHAT_TYPES) {
    return this.socket.fromEvent<T>(type);
  }
}
