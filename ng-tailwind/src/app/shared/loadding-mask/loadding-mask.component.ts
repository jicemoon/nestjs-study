import { Component, OnInit } from '@angular/core';
import { BusEventType } from '@app/models/eventbus.interface';
import { EventBusService } from '@app/services/event-bus.service';

@Component({
  selector: 'app-loadding-mask',
  templateUrl: './loadding-mask.component.html',
  styleUrls: ['./loadding-mask.component.scss'],
})
export class LoaddingMaskComponent implements OnInit {
  isLoadding = false;
  constructor(private eventbusService: EventBusService) {}
  ngOnInit() {
    this.eventbusService.on<boolean>(BusEventType.loading).subscribe(loadding => {
      console.log('reese', 'loadding', loadding);
      this.isLoadding = loadding;
    });
  }
}
