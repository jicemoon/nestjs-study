import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyDate } from '@app/extends/MyDate';
import { IUserInfo } from '@app/models';
import { AuthService } from '@app/services/auth.service';

import { IMsg, MsgItem, SocketEventType, SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private userInfo: IUserInfo;
  private currentUserInfo: IUserInfo;
  public msg: string;
  public msgList: MsgItem[] = [];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private socketService: SocketService,
  ) {}

  ngOnInit() {
    this.currentUserInfo = this.authService.getUserInfo() as IUserInfo;
    this.socketService.getMessage(this.currentUserInfo.id).subscribe(msg => this.messageHandle(msg));
    this.route.paramMap.subscribe(params => {
      const userID = params.get('id');
      if (userID) {
        this.userService.getUserByIdOrEmail(userID).subscribe(userInfo => {
          this.userInfo = userInfo;
          this.socketService.login(this.currentUserInfo, this.userInfo);
        });
        // this.msgList.push({
        //   from: this.currentUserInfo.id,
        //   to: userID,
        //   msg: 'css test dkfjke深刻的积分卡撒娇人福科技开房间撒打开房间撒快乐大家分开撒大家疯狂拉升',
        //   createDate: new MyDate().format(),
        //   token: Date.now(),
        //   isSelf: true,
        //   loading: false,
        //   userInfo: this.currentUserInfo,
        // });
      }
      // this.socketService.login(this.authService.getUserInfo() as IUserInfo, this.userInfo);
      this.socketService.loginMessage().subscribe(msgs => this.initMsgs(msgs));
      this.socketService.getMessage(userID).subscribe(msg => this.messageHandle(msg));
    });
  }
  initMsgs(msgs: MsgItem[]) {
    console.log('reese', '22222222222', msgs);
    this.msgList = msgs.map(msgDoc => {
      return {
        ...msgDoc,
        isSelf: msgDoc.from === this.currentUserInfo.id,
        loading: false,
        userInfo: msgDoc.userInfo || (msgDoc.from === this.currentUserInfo.id ? this.currentUserInfo : this.userInfo),
      };
    });
  }
  messageHandle(msg: IMsg) {
    const msgItem = this.msgList.find(item => item.token === msg.token);
    if (msgItem) {
      msgItem.loading = false;
    } else {
      this.msgList.push({
        ...msg,
        userInfo: this.userInfo,
        isSelf: false,
        loading: false,
      });
    }
  }
  sendMsg(evt: Event) {
    evt.preventDefault();
    const msg = {
      from: this.currentUserInfo.id,
      to: this.userInfo.id,
      msg: this.msg,
      createDate: new MyDate().format(),
      token: Date.now(),
    };
    this.msgList.push({
      ...msg,
      userInfo: this.currentUserInfo,
      loading: true,
      isSelf: true,
    });
    this.socketService.sendMessage(msg);
  }
}
