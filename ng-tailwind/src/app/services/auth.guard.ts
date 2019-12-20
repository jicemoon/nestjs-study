import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router,
    RouterStateSnapshot, UrlSegment, UrlTree
} from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin(state.url);
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkLogin(state.url);
  }
  canLoad(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }
  checkLogin(url?: string) {
    this.authService.redirectUrl = url;
    return this.authService.hasLogin().pipe(
      tap(isLogin => {
        if (!isLogin) {
          this.router.navigate(['/login']);
        }
      }),
    );
  }
}
