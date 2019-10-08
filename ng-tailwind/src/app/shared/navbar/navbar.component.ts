import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public isLogin = this.authService.isLogin$;
  public isShow = false;
  constructor(private authService: AuthService) {}

  ngOnInit() {}
  logout() {
    this.authService.logout();
  }
  toggleMenu() {
    this.isShow = !this.isShow;
  }
}
