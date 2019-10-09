import { Component, Input, OnInit } from '@angular/core';
import { MsgItem } from '@app/models/message.interface';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent implements OnInit {
  @Input() msgItem: MsgItem;
  constructor() {}

  ngOnInit() {}
}
