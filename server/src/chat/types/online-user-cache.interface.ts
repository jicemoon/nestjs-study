import { Socket } from 'socket.io';

import { UserInfo } from '@app/user/types/user-info';

export interface IOnlineUserCache {
  loginTime: Date;
  userInfo: UserInfo;
  socket: Socket;
}

export interface IOnlineUsersCache {
  [key: string]: IOnlineUserCache;
}
