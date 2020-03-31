import { Subscription } from 'rxjs';
import { EventBusService } from '@app/services/event-bus.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MsgItem } from '@app/models/message.interface';
import { BusEventType } from '@app/models/eventbus.interface';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent {
  @Input() msgItem: MsgItem;
  constructor() {}
}
