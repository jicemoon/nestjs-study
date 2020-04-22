import { Component, Input } from '@angular/core';
import { MsgItem } from '@app/models/message.interface';
import { of } from 'rxjs';

@Component({
  selector: 'app-chat-item',
  templateUrl: './chat-item.component.html',
  styleUrls: ['./chat-item.component.scss'],
})
export class ChatItemComponent {
  private item: MsgItem;
  @Input()
  set msgItem(val: MsgItem) {
    if (val.files && val.files.length > 0) {
      val.files.forEach(f => {
        if (!f.$uri) {
          f.$uri = of(f.uri);
        }
      });
    }
    this.item = val;
  }
  get msgItem() {
    return this.item;
  }
  constructor() {}
}
