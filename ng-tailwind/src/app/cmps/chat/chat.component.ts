import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyDate } from '@app/extends/MyDate';
import { IUserInfo } from '@app/models';
import { BusEventType } from '@app/models/eventbus.interface';
import { IMsg, MsgItem } from '@app/models/message.interface';
import { AuthService } from '@app/services/auth.service';
import { EventBusService } from '@app/services/event-bus.service';
import { SocketService } from '@app/services/socket.service';
import { UserService } from '@app/services/user.service';

import { MessageType } from '../../models/message-type.enum';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  private type: MessageType;
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
    this.route.paramMap.subscribe(params => {
      const userID = params.get('id');
      this.type = +params.get('type') || MessageType.personal;
      if (userID) {
        this.userService.getUserByIdOrEmail(userID).subscribe(userInfo => {
          this.userInfo = userInfo;
          this.eventbusService.emit<string>({ type: BusEventType.headTitle, data: this.userInfo.name });
        });
      }
      this.socketService.getInitPersonalLog(userID).subscribe(json => {
        this.socketService.getPersonalMsg(userID).subscribe(msg => this.messageHandle(msg));
        this.initMsgs(json.msgs);
      });
      this.socketService.openPersonalWindow(userID);
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
    this.socketService.sendPersonalMsg(msg);
  }
}
