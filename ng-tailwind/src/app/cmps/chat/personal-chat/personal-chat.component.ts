import { FileModalSubmitParm } from './../../../models/file-modal-submit-parm';
import { IFileInfo } from './../../../models/fileinfo.interface';
import { timer, Subscription, Observable } from 'rxjs';

import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MyDate } from '@app/extends/MyDate';
import { IUserInfo } from '@app/models';
import { IMsg, MsgItem } from '@app/models/message.interface';
import { AuthService } from '@app/services/auth.service';
import { EventBusService } from '@app/services/event-bus.service';
import { SocketService } from '@app/services/socket.service';
import { ToastService } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { BusEventType } from '@app/models/eventbus.interface';
import { blobToBase64 } from '@app/tools/utils';

@Component({
  selector: 'app-personal-chat',
  templateUrl: './personal-chat.component.html',
  styleUrls: ['./personal-chat.component.scss'],
})
export class PersonalChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chatContainer', { static: true })
  private container: ElementRef;

  @ViewChildren('messages')
  private messagesRef: QueryList<any>;

  private userInfo: IUserInfo;

  private currentUserInfo: IUserInfo;
  public msg: string = '';
  public msgList: MsgItem[] = [];
  public eventBus$: Subscription;

  public pastImageURI: Observable<string>;

  public showFileModal: boolean = false;
  public fileMsg: string = '';
  public fileList: IFileInfo[];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private socketService: SocketService,
    private eventbusService: EventBusService,
    private toastService: ToastService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentUserInfo = this.authService.getUserInfo() as IUserInfo;
    this.route.paramMap.subscribe(params => {
      const userID = params.get('id');
      if (userID) {
        this.userService.getUserByIdOrEmail(userID).subscribe(userInfo => {
          this.userInfo = userInfo;
          this.eventbusService.emitTitle(this.userInfo.name);
        });
        this.socketService.getInitPersonalLog(userID).subscribe(json => {
          this.socketService
            .getPersonalMsg(userID)
            .subscribe(msg => this.messageHandle(msg));
          this.initMsgs(json.msgs);
        });
        this.socketService.openPersonalWindow(userID);
      } else {
        this.toastService.error('没有找到对应用户', 4000);
        timer(4000).subscribe(() => this.location.back());
      }
    });
    this.eventbusService.emitBackButton({ isShow: true });

    this.eventBus$ = this.eventbusService
      .on<MouseEvent>(BusEventType.headTitleClick)
      .subscribe(evt => {
        this.router.navigate(['/personalInfo', this.userInfo.id]);
      });
  }
  ngAfterViewInit() {
    this.messagesRef.changes.subscribe(() => this.scrollToEnd());
  }
  ngOnDestroy() {
    this.eventbusService.emitTitle('');
    this.eventBus$.unsubscribe();
  }
  initMsgs(msgs: MsgItem[]) {
    this.msgList = msgs.map(msgDoc => {
      return {
        ...msgDoc,
        isSelf: msgDoc.from === this.currentUserInfo.id,
        loading: false,
        userInfo:
          msgDoc.userInfo ||
          (msgDoc.from === this.currentUserInfo.id
            ? this.currentUserInfo
            : this.userInfo),
      };
    });
  }
  messageHandle(msg: IMsg) {
    const msgItem = this.msgList.find(
      item => item.isSelf && item.token === msg.token,
    );
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
  sendMsgSubmit(evt: Event) {
    evt.preventDefault();
    this.sendMsg(this.msg);
  }
  sendMsg(msg?: string, files?: IFileInfo[]) {
    if (!msg && (!files || files.length === 0)) {
      return;
    }
    const message: IMsg = {
      from: this.currentUserInfo.id,
      to: this.userInfo.id,
      msg,
      createDate: new MyDate().format(),
      token: Date.now(),
    };

    const showFiles = [];
    if (files && files.length > 0) {
      const pushFiles = [];
      files.forEach(file => {
        pushFiles.push({
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          buffer: file.buffer,
        });
        showFiles.push({
          originalname: file.originalname,
          uri: file.uri,
          $uri: file.$uri,
          mimetype: file.mimetype,
        });
      });
      message.files = pushFiles;
    }
    this.msgList.push({
      ...message,
      files: showFiles,
      userInfo: this.currentUserInfo,
      loading: true,
      isSelf: true,
    });
    this.msg = '';
    this.socketService.sendPersonalMsg(message);
  }
  scrollToEnd() {
    window.scrollTo(0, this.container.nativeElement.scrollHeight);
  }

  @HostListener('window:paste', ['$event'])
  onPastHandle(evt: ClipboardEvent) {
    if (this.showFileModal) {
      return;
    }
    const items = evt.clipboardData.items;
    const files: IFileInfo[] = [];
    for (let i = 0, lens = items.length; i < lens; i++) {
      const item = items[i];
      switch (item.kind) {
        case 'string':
          item.getAsString(str => {
            this.msg += str;
          });
          break;
        case 'file':
          const file = item.getAsFile();
          if (/^image/i.test(file.type)) {
            const exts = file.name.split('.');
            const dateStr = new MyDate().format('yyyymmddhhMMss');
            const originalname = `${dateStr}.${exts[exts.length - 1]}`;
            files.push({
              $uri: blobToBase64(file),
              originalname,
              mimetype: file.type,
              size: file.size,
              buffer: file,
            });
          }
          break;
      }
    }
    // this.sendMsg(this.msg, files);
    if (files.length > 0) {
      this.showFileModal = true;
      this.fileMsg = this.msg;
      this.fileList = files;
      this.msg = '';
    }
  }

  fileModalCancel(msg: string) {
    this.msg = msg;
    this.showFileModal = false;
  }
  fileModalConfirm(msg: FileModalSubmitParm) {
    this.sendMsg(msg.msg, msg.files);
    this.showFileModal = false;
  }
}
