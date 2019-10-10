import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BusEventType, IBackBackButtonData } from '@app/models/eventbus.interface';
import { AuthService } from '@app/services/auth.service';
import { EventBusService } from '@app/services/event-bus.service';

const ROUTE_LIST: { path: any[]; label: string }[] = [
  { path: ['/userList'], label: '用户列表' },
  { path: ['/personalInfo'], label: '个人资料' },
  { path: ['/help'], label: '帮助' },
];
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isLogin = false;
  public isShow = false;
  public title: string;
  public routers = [];
  public backBtnType: IBackBackButtonData = {};
  constructor(private authService: AuthService, private eventBusService: EventBusService, private location: Location) {}

  ngOnInit() {
    this.authService.isLogin$.subscribe(b => {
      this.routers = b ? ROUTE_LIST : [];
      this.isLogin = b;
    });
    this.eventBusService.on<string>(BusEventType.headTitle).subscribe(title => {
      this.title = title;
    });
    this.eventBusService.on<IBackBackButtonData>(BusEventType.backButton).subscribe(b => {
      this.backBtnType = b || {};
    });
  }
  logout() {
    this.authService.logout();
  }
  toggleMenu() {
    this.isShow = !this.isShow;
  }
  backHandle(evt: MouseEvent) {
    this.eventBusService.emitBackButton({ isShow: false });
    if (this.backBtnType.isCustom) {
      this.eventBusService.emitBackButtonHandle(evt);
    } else {
      this.location.back();
    }
  }
}
