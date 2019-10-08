import { of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateUserDTO, IFileInfo, IResponseData, IUserInfo } from '@app/models';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  URI = `${environment.apiRoot}/user`;
  constructor(private http: HttpClient, private authService: AuthService) {}

  public createUser(user: ICreateUserDTO, f?: File) {
    return this.uploadFile(f).pipe(
      map<IResponseData<IFileInfo>, IFileInfo>(json => json.data),
      concatMap((fileInfo: IFileInfo) => {
        if (fileInfo) {
          user = { ...user, avatar: fileInfo.filePath };
        }
        return this.http.post<IResponseData<IUserInfo>>(this.URI, user);
      }),
      tap((json: IResponseData<IUserInfo>) => {
        this.authService.setToken(json.data);
      }),
    );
  }
  public uploadFile(f: File) {
    if (!f) {
      return of<IResponseData<IFileInfo>>({ status: false, message: '', data: null });
    }
    const formData = new FormData();
    formData.append('avatar', f, f.name);
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<IResponseData<IFileInfo>>(`${this.URI}/uploadAvatar`, formData, { headers });
  }
  public getUsers() {
    return this.http.get<IResponseData<IUserInfo[]>>(this.URI).pipe(
      map(json => {
        json.data = (json.data || []).filter(user => user.email !== this.authService.getUserInfo('email'));
        return json;
      }),
    );
  }
  public getUserByIdOrEmail(idOrEmail: string) {
    return this.http.get<IResponseData<IUserInfo>>(`${this.URI}/${idOrEmail}`).pipe(map(res => res.data));
  }
}
