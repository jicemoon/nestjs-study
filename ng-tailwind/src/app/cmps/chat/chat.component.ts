import { Component, OnInit } from '@angular/core';
import { IMsg, MsgItem } from '@app/models/message.interface';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { BusEventType } from '@app/models/eventbus.interface';
import { EventBusService } from '@app/services/event-bus.service';
import { IUserInfo } from '@app/models';
import { MessageType } from '../../models/message-type.enum';
import { MyDate } from '@app/extends/MyDate';
import { SocketService } from '@app/services/socket.service';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private type: MessageType;
  private roomID: string;
  private userInfo: IUserInfo;
  private currentUserInfo: IUserInfo;
  public msg: string;
  public msgList: MsgItem[] = [];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private socketService: SocketService,
    private eventbusService: EventBusService,
  ) {}

  ngOnInit() {
    this.currentUserInfo = this.authService.getUserInfo() as IUserInfo;
    this.socketService.getMessage(this.currentUserInfo.id).subscribe(msg => this.messageHandle(msg));
    this.route.paramMap.subscribe(params => {
      const userID = params.get('id');
      this.type = +params.get('type') || MessageType.personal;
      if (userID) {
        this.userService.getUserByIdOrEmail(userID).subscribe(userInfo => {
          this.userInfo = userInfo;
          this.socketService.login(this.currentUserInfo, this.userInfo, this.type);
          this.eventbusService.emit<string>({ type: BusEventType.headTitle, data: this.userInfo.name });
        });
      }
      this.socketService.loginMessage().subscribe(json => {
        this.roomID = json.roomID;
        this.socketService.getMessage(this.roomID).subscribe(msg => this.messageHandle(msg));
        this.socketService.getOnlineUser(this.roomID, this.currentUserInfo.id).subscribe(user => console.log(`${user.name}上线了`));
        this.initMsgs(json.msgs);
      });
    });
  }
  initMsgs(msgs: MsgItem[]) {
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
    if (!this.msg) {
      return;
    }
    const msg = {
      type: this.type,
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
    this.msg = '';
    this.socketService.sendMessage(msg);
  }
}
