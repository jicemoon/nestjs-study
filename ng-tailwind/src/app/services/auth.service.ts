import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginDTO, IResponseData, IUserInfo } from '@app/models';

import { getErrorMsg } from '../tools/utils';
import { SocketService } from './socket.service';
import { ToastService } from './toast.service';

export const TOKEN_KEY = 'TOKEN_KEY';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  URI = `${environment.apiRoot}`;
  private userInfo: IUserInfo;
  private isLogin = new Subject<boolean>();
  redirectUrl: string;

  public get isLogin$() {
    return this.isLogin.asObservable();
  }
  constructor(
    private socketService: SocketService,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
  ) {}
  public login(user: ILoginDTO) {
    this.removeToken();
    return this.http
      .post<IResponseData<IUserInfo>>(`${this.URI}/login`, user)
      .pipe(
        filter(json => {
          if (json.status) {
            this.setToken(json.data);
          } else {
            this.toast.error(getErrorMsg(json));
          }
          return json.status;
        }),
      );
  }
  public getUserInfo(key?: keyof IUserInfo) {
    return key ? this.userInfo[key] : this.userInfo;
  }
  public setToken(userInfo: IUserInfo) {
    this.userInfo = userInfo;
    this.router.navigate([this.redirectUrl || '']);
    this.isLogin.next(true);
    this.redirectUrl = '';
    if (userInfo.token) {
      localStorage.setItem(TOKEN_KEY, userInfo.token);
    }
    this.socketService.loginUser(userInfo);
  }
  public getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
  public removeToken() {
    this.userInfo = null;
    this.isLogin.next(false);
    localStorage.removeItem(TOKEN_KEY);
  }
  public logout() {
    this.removeToken();
    this.router.navigate(['/login']);
  }
  public hasLogin(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      this.isLogin.next(false);
      return of(false);
    }
    if (this.userInfo) {
      this.isLogin.next(true);
      return of(true);
    } else {
      const headers = new HttpHeaders();
      headers.append('token', token);
      return this.http
        .get<IResponseData<IUserInfo>>(`${this.URI}/getUserInfo`, {
          headers,
        })
        .pipe(
          map(json => {
            if (
              !json.status &&
              (json.statusCode === 401 || json.statusCode === 402)
            ) {
              this.logout();
            }
            if (json.status) {
              this.setToken(json.data);
            }
            this.isLogin.next(json.status);
            return json.status;
          }),
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.router.navigate(['/login']);
              this.toast.error('您没有此权限');
            }
            this.isLogin.next(false);
            return of(false);
          }),
        );
    }
  }
}
