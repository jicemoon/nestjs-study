import { Component, OnInit } from '@angular/core';
import { BusEventType } from '@app/models/eventbus.interface';
import { ToastMessage } from '@app/models/toastMessage';
import { EventBusService } from '@app/services/event-bus.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  messages: ToastMessage[] = [];
  constructor(private eventbus: EventBusService) {}

  ngOnInit() {
    this.eventbus
      .on<ToastMessage | ToastMessage[]>(BusEventType.toastMessage)
      .subscribe(msg => {
        if (!Array.isArray(msg)) {
          msg = [msg];
        }
        this.messages = [...this.messages, ...msg];
      });
  }
  remove(idx: number) {
    this.messages.splice(idx, 1);
  }
}
