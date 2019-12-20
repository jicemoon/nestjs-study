import { Observable, of, Subject } from 'rxjs';
import { delay, map, mergeAll } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { BusEventType } from '@app/models/eventbus.interface';
import { ToastMessage } from '@app/models/toastMessage';
import { EventBusService } from '@app/services/event-bus.service';

import { TOAST_DURATION } from '../../models/toastMessage';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit {
  messages: ToastMessage[] = [];
  subs = new Subject<ToastMessage>();
  subs$: Observable<ToastMessage> = this.subs.asObservable().pipe(
    map(val => {
      return of(val).pipe(delay(val.duration || TOAST_DURATION));
    }),
    mergeAll(),
  );
  constructor(private eventbus: EventBusService) {}

  ngOnInit() {
    this.subs$.subscribe(val => {
      this.messages = this.messages.filter(v => v !== val);
    });
    this.eventbus
      .on<ToastMessage | ToastMessage[]>(BusEventType.toastMessage)
      .subscribe(msg => {
        if (!Array.isArray(msg)) {
          msg = [msg];
        }
        this.messages = [...this.messages, ...msg];
        msg.forEach(val => {
          if (typeof val.duration === 'undefined' || val.duration > 0) {
            this.subs.next(val);
          }
        });
      });
  }
  remove(idx: number) {
    this.messages.splice(idx, 1);
  }
}
