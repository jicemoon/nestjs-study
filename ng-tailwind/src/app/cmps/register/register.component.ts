import { Component, OnInit } from '@angular/core';
import { ICreateUserDTO } from '@app/models/user.dto';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  email: string = 'reese111@test.com'; //
  name: string = 'reese111'; //
  password: string = 'aaaa1111'; //
  confirmPw: string = 'aaaa1111'; //
  avatar: File;
  constructor(private userService: UserService) {}

  ngOnInit() {}
  onSubmit(evt: Event) {
    this.userService
      .createUser(
        {
          name: this.name,
          email: this.email,
          password: this.password,
        } as ICreateUserDTO,
        this.avatar,
      )
      .subscribe();
    evt.preventDefault();
  }
  onFileChange(fileInput: HTMLInputElement) {
    this.avatar = fileInput.files[0];
  }
}
