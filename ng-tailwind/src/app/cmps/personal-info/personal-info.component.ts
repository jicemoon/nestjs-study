import { of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserInfo } from '@app/models/userinfo.interface';
import { AuthService } from '@app/services/auth.service';
import { UserService } from '@app/services/user.service';

import { EventBusService } from '../../services/event-bus.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  public userInfo: IUserInfo;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private evtbusService: EventBusService,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        concatMap(params => {
          const id = params.get('id');
          if (id) {
            return this.userService.getUserByIdOrEmail(id);
          } else {
            return of(this.authService.getUserInfo() as IUserInfo);
          }
        }),
      )
      .subscribe(user => {
        this.userInfo = user;
        this.evtbusService.emitTitle(this.userInfo.name);
      });
    this.evtbusService.emitBackButton({ isShow: true });
  }
  ngOnDestroy(): void {
    this.evtbusService.emitTitle('');
  }
}
