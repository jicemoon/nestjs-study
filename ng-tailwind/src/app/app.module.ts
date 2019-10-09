import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './cmps/chat/chat.component';
import { HelpComponent } from './cmps/help/help.component';
import { LoginComponent } from './cmps/login/login.component';
import { RegisterComponent } from './cmps/register/register.component';
import { UserListComponent } from './cmps/user-list/user-list.component';
import { authHttpInterceptorProviders } from './services/auth.interceptor';
import { LoaddingMaskComponent } from './shared/loadding-mask/loadding-mask.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ChatItemComponent } from './cmps/chat/chat-item/chat-item.component';

const socketIOConfig: SocketIoConfig = {
  url: environment.socketRoot,
  options: {},
};
@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    NavbarComponent,
    ChatComponent,
    LoaddingMaskComponent,
    ChatItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FormsModule,
    SocketIoModule.forRoot(socketIOConfig),
  ],
  providers: [authHttpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
