import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserInfo } from '@app/models';
import { MessageType } from '@app/models/message-type.enum';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  userList: IUserInfo[] = [];
  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.getUserList();
  }
  getUserList() {
    this.userService.getUsers().subscribe(res => {
      this.userList = res.data || [];
    });
  }
  toChat(user: IUserInfo) {
    this.router.navigate(['chat', MessageType.personal, user.id]);
  }
}
