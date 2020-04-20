import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateUserDTO, IResponseData, IUserInfo } from '@app/models';
import { BusEventType } from '@app/models/eventbus.interface';
import { AuthService } from '@app/services/auth.service';

import { getErrorMsg } from '../tools/utils';
import { EventBusService } from './event-bus.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  URI = `${environment.apiRoot}/user`;
  cacheUsersObj: { [key: string]: IUserInfo };
  cacheUserList: IUserInfo[];
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private eventbusService: EventBusService,
    private toastService: ToastService,
  ) {}
  public createUser(user: ICreateUserDTO, f?: File) {
    const time = +Date.now();
    this.eventbusService.emit({
      type: BusEventType.loading,
      token: time,
      data: true,
    });

    const formData = new FormData();
    formData.append('avatar', f, f.name);
    Object.entries(user).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http
      .post<IResponseData<IUserInfo>>(this.URI, formData, { headers })
      .pipe(
        tap((json: IResponseData<IUserInfo>) => {
          if (json.status) {
            this.authService.setToken(json.data);
            this.toastService.success('注册用户成功');
          } else {
            this.toastService.error(getErrorMsg(json));
          }
          this.eventbusService.emit({
            type: BusEventType.loading,
            token: time,
            data: false,
          });
        }),
      );
  }
  // public createUser(user: ICreateUserDTO, f?: File) {
  //   const time = +Date.now();
  //   this.eventbusService.emit({
  //     type: BusEventType.loading,
  //     token: time,
  //     data: true,
  //   });
  //   return this.uploadFile(f).pipe(
  //     map<IResponseData<IFileInfo>, IFileInfo>(json => json.data),
  //     concatMap((fileInfo: IFileInfo) => {
  //       if (fileInfo) {
  //         user = { ...user, avatar: fileInfo.filePath };
  //       }
  //       return this.http.post<IResponseData<IUserInfo>>(this.URI, user);
  //     }),
  //     tap((json: IResponseData<IUserInfo>) => {
  //       if (json.status) {
  //         this.authService.setToken(json.data);
  //         this.toastService.success('注册用户成功');
  //       } else {
  //         this.toastService.error(getErrorMsg(json));
  //       }
  //       this.eventbusService.emit({
  //         type: BusEventType.loading,
  //         token: time,
  //         data: false,
  //       });
  //     }),
  //   );
  // }
  // public uploadFile(f: File) {
  //   if (!f) {
  //     return of<IResponseData<IFileInfo>>({
  //       status: false,
  //       message: '',
  //       data: null,
  //     });
  //   }
  //   const time = +Date.now();
  //   this.eventbusService.emit({
  //     type: BusEventType.loading,
  //     token: time,
  //     data: true,
  //   });
  //   const formData = new FormData();
  //   formData.append('avatar', f, f.name);
  //   const headers = new HttpHeaders();
  //   headers.append('Content-Type', 'multipart/form-data');
  //   return this.http
  //     .post<IResponseData<IFileInfo>>(`${this.URI}/uploadAvatar`, formData, {
  //       headers,
  //     })
  //     .pipe(
  //       tap(() =>
  //         this.eventbusService.emit({
  //           type: BusEventType.loading,
  //           token: time,
  //           data: false,
  //         }),
  //       ),
  //     );
  // }
  public getUsers() {
    const time = +Date.now();
    if (this.cacheUserList) {
      return of({ data: this.cacheUserList } as IResponseData<IUserInfo[]>);
    }
    this.eventbusService.emit({
      type: BusEventType.loading,
      token: time,
      data: true,
    });
    return this.http.get<IResponseData<IUserInfo[]>>(this.URI).pipe(
      map(json => {
        json.data = (json.data || []).filter(
          user => user.email !== this.authService.getUserInfo('email'),
        );
        this.cacheUsersObj = json.data.reduce<{ [key: string]: IUserInfo }>(
          (pre, value) => {
            pre[value.id] = value;
            return pre;
          },
          {},
        );
        this.cacheUserList = json.data;
        return json;
      }),
      tap(() => {
        this.eventbusService.emit({
          type: BusEventType.loading,
          token: time,
          data: false,
        });
      }),
    );
  }
  public getUserByIdOrEmail(idOrEmail: string) {
    let data: IUserInfo;
    if (this.cacheUserList && this.cacheUserList.length > 0) {
      data = this.cacheUsersObj[idOrEmail];
      if (idOrEmail.indexOf('@') > -1) {
        data = this.cacheUserList.find(value => value.email === idOrEmail);
      }
    }
    if (data) {
      return of(data);
    } else {
      return this.http
        .get<IResponseData<IUserInfo>>(`${this.URI}/${idOrEmail}`)
        .pipe(map(res => res.data));
    }
  }
}
