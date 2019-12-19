import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { BusEventType, IBackBackButtonData, IBusEvent } from '@app/models/eventbus.interface';
import { ToastMessage } from '@app/models/toastMessage';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventBus: Subject<IBusEvent<any>> = new Subject<IBusEvent<any>>();
  private eventbus$ = this.eventBus.asObservable();
  private loaddingTokens: number[] = [];
  constructor() {}
  public emitTitle(data: string) {
    this.emit<string>({ type: BusEventType.headTitle, data });
  }
  public emitLoadding(data: boolean) {
    this.emit<boolean>({ type: BusEventType.loading, data });
  }
  public emitBackButton(data: IBackBackButtonData) {
    this.emit<IBackBackButtonData>({ type: BusEventType.backButton, data });
  }
  public emitBackButtonHandle(data: MouseEvent) {
    this.emit<MouseEvent>({ type: BusEventType.backButtonHandle, data });
  }
  public emitTostMessage(data: ToastMessage | ToastMessage[]) {
    this.emit<ToastMessage | ToastMessage[]>({
      type: BusEventType.toastMessage,
      data,
    });
  }
  public emit<T>(evt: IBusEvent<T>) {
    if (evt.type === BusEventType.loading) {
      const { data } = evt;
      if (data) {
        this.loaddingTokens.push(evt.token);
        this.eventBus.next(evt);
      } else {
        let hasToken = false;
        this.loaddingTokens = this.loaddingTokens.filter(token => {
          if (token === evt.token) {
            hasToken = true;
          }
          return token !== evt.token;
        });
        if (hasToken && this.loaddingTokens.length <= 0) {
          this.eventBus.next(evt);
        }
      }
    } else {
      this.eventBus.next(evt);
    }
  }
  public on<T>(type: BusEventType) {
    return this.eventbus$.pipe(
      filter((evt: IBusEvent<T>) => evt.type === type),
      map(evt => evt.data),
    );
  }
  public onAll() {
    return this.eventbus$;
  }
}
