import { IMsg, MsgItem, SocketEventType } from '@app/models/message.interface';
import { filter, map } from 'rxjs/operators';

import { IUserInfo } from '@app/models/userinfo.interface';
import { Injectable } from '@angular/core';
import { MessageType } from '@app/models/message-type.enum';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('reese', 'Socket Connected');
    });
  }
  login(from: IUserInfo, to: IUserInfo, type: MessageType) {
    this.socket.emit(SocketEventType.login, { from, to, type });
  }
  loginMessage() {
    return this.socket.fromEvent<{ roomID: string; user: IUserInfo; msgs: MsgItem[] }>('login');
  }
  sendMessage(msg: IMsg) {
    this.socket.emit(SocketEventType.msgToServer, msg);
  }
  getOnlineUser(roomID: string, userID: string) {
    return this.socket.fromEvent<{ roomID: string; user: IUserInfo }>('onlineUser').pipe(
      filter(json => json.roomID === roomID && json.user.id !== userID ),
      map(json => json.user),
    );
  }
  getMessage(type: string) {
    return this.socket.fromEvent<IMsg>(type);
  }
}
