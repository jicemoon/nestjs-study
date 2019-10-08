import { Socket } from 'ngx-socket-io';

import { Injectable } from '@angular/core';

import { IUserInfo } from '../models/userinfo.interface';

export enum SocketEventType {
  login = 'login',
  msgToServer = 'msgToServer',
  msgToClient = 'msgToClient',
}
export interface IMsg {
  from: string;
  to: string;
  msg: string;
  createDate?: string;
  token?: number;
}
export interface MsgItem extends IMsg {
  loading: boolean;
  isSelf: boolean;
  userInfo: IUserInfo;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {
    this.socket.on('connect', () => {
      console.log('reese', 'Socket Connected');
    });
  }
  login(from: IUserInfo, to: IUserInfo) {
    this.socket.emit(SocketEventType.login, { from, to });
  }
  loginMessage() {
    return this.socket.fromEvent<MsgItem[]>('login');
  }
  sendMessage(msg: IMsg) {
    this.socket.emit(SocketEventType.msgToServer, msg);
  }
  getMessage(type: string) {
    return this.socket.fromEvent<IMsg>(type);
  }
}
