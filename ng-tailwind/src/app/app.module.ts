import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';
import { AppRoutingModule, components } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatItemComponent } from './cmps/chat/chat-item/chat-item.component';
import { authHttpInterceptorProviders } from './services/auth.interceptor';
import { LoaddingMaskComponent } from './shared/loadding-mask/loadding-mask.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ToastComponent } from './shared/toast/toast.component';
import { MergeComponent } from './cmps/rxjs/merge/merge.component';
import { FileModalComponent } from './cmps/chat/file-modal/file-modal.component';
import { AddFileBtnComponent } from './shared/add-file-btn/add-file-btn.component';

const socketIOConfig: SocketIoConfig = {
  url: environment.socketRoot,
  options: {},
};
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoaddingMaskComponent,
    ChatItemComponent,
    ToastComponent,
    ...components,
    MergeComponent,
    FileModalComponent,
    AddFileBtnComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(socketIOConfig),
  ],
  providers: [authHttpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
