import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { BusEventType } from '@app/models/eventbus.interface';
import { AuthService } from '@app/services/auth.service';
import { EventBusService } from '@app/services/event-bus.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isLogin = this.authService.isLogin$;
  public isShow = false;
  public title: string;
  constructor(private authService: AuthService, private eventBusService: EventBusService) {}

  ngOnInit() {
    this.eventBusService.on<string>(BusEventType.headTitle).subscribe(title => {
      this.title = title;
    });
  }
  logout() {
    this.authService.logout();
  }
  toggleMenu() {
    this.isShow = !this.isShow;
  }
}
