import { Injectable } from '@angular/core';
import { ToastMessageType } from '@app/models/toastMessage';
import { EventBusService } from '@app/services/event-bus.service';

import { TOAST_DURATION, ToastMessage } from '../models/toastMessage';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private evtBus: EventBusService) {}
  message(msg: ToastMessage) {
    this.evtBus.emitTostMessage(msg);
  }
  error(message, duration: number = TOAST_DURATION) {
    this.evtBus.emitTostMessage(
      new ToastMessage(message, ToastMessageType.error, duration),
    );
  }
  warn(message, duration: number = TOAST_DURATION) {
    this.evtBus.emitTostMessage(
      new ToastMessage(message, ToastMessageType.warn, duration),
    );
  }
  info(message, duration: number = TOAST_DURATION) {
    this.evtBus.emitTostMessage(
      new ToastMessage(message, ToastMessageType.info, duration),
    );
  }
  success(message, duration: number = TOAST_DURATION) {
    this.evtBus.emitTostMessage(
      new ToastMessage(message, ToastMessageType.success, duration),
    );
  }
}
