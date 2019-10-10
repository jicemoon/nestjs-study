import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonalChatComponent } from './cmps/chat/personal-chat/personal-chat.component';
import { HelpComponent } from './cmps/help/help.component';
import { LoginComponent } from './cmps/login/login.component';
import { PersonalInfoComponent } from './cmps/personal-info/personal-info.component';
import { RegisterComponent } from './cmps/register/register.component';
import { UserListComponent } from './cmps/user-list/user-list.component';
import { AuthGuard } from './services/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';

const guard = { canActivate: [AuthGuard], canActivateChild: [AuthGuard] };
const routes: Routes = [
  { path: '', redirectTo: 'userList', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'userList', component: UserListComponent, ...guard },
  { path: 'help', component: HelpComponent, ...guard },
  { path: 'personalInfo', component: PersonalInfoComponent, ...guard },
  { path: 'personalInfo/:id', component: PersonalInfoComponent, ...guard },
  { path: 'personalChat/:id', component: PersonalChatComponent, ...guard },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
