import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string = 'reese@gmail.com';
  password: string = 'aaaa1111';
  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit() {}
  onSubmit(evt: Event) {
    this.userService
      .login({
        email: this.email,
        password: this.password,
      })
      .subscribe(json => {
        if (json.status) {
          this.router.navigate(['/']);
        } else {
          alert(json.message || json.error);
        }
      });
    evt.preventDefault();
  }
}
