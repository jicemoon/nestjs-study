import { Observable, of, Subject } from 'rxjs';
import { delay, map, mergeAll } from 'rxjs/operators';

import {
    animate, keyframes, query, stagger, style, transition, trigger
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { BusEventType } from '@app/models/eventbus.interface';
import { ToastMessage } from '@app/models/toastMessage';
import { EventBusService } from '@app/services/event-bus.service';

import { TOAST_DURATION } from '../../models/toastMessage';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        stagger(
          '80ms',
          animate(
            '300ms ease-in-out',
            keyframes([
              style({ opacity: 0, height: 0, offset: 0 }),
              style({ opacity: 0.6, height: 'auto', offset: 0.8 }),
              style({ opacity: 1, height: 'auto', offset: 1 }),
            ]),
          ),
        ),
      ],
      { optional: true },
    ),
    query(':leave', animate('200ms', style({ opacity: 0, height: 0 })), {
      optional: true,
    }),
  ]),
]);
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  animations: [listAnimation],
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
