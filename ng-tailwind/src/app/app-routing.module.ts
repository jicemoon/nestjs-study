import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './cmps/chat/chat.component';
import { HelpComponent } from './cmps/help/help.component';
import { LoginComponent } from './cmps/login/login.component';
import { RegisterComponent } from './cmps/register/register.component';
import { UserListComponent } from './cmps/user-list/user-list.component';
import { AuthGuard } from './services/auth.guard';

const guard = { canActivate: [AuthGuard], canActivateChild: [AuthGuard] };
const routes: Routes = [
  { path: '', redirectTo: 'userList', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'userList', component: UserListComponent, ...guard },
  { path: 'help', component: HelpComponent, ...guard },
  { path: 'chat/:type/:id', component: ChatComponent, ...guard },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
