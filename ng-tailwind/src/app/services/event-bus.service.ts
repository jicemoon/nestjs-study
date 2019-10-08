import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { BusEventType, IBusEvent } from '@app/models/eventbus.interface';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventBus: Subject<IBusEvent<any>> = new Subject<IBusEvent<any>>();
  private eventbus$ = this.eventBus.asObservable();
  constructor() {}
  public emit<T>(evt: IBusEvent<T>) {
    this.eventBus.next(evt);
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
