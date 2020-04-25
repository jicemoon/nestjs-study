import { EventBusService } from '@app/services/event-bus.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IFileInfo } from '@app/models';
import { blobToBase64 } from '@app/tools/utils';
import { ToastMessageType } from '@app/models/toastMessage';

@Component({
  selector: 'app-add-file-btn',
  templateUrl: './add-file-btn.component.html',
  styleUrls: ['./add-file-btn.component.scss'],
})
export class AddFileBtnComponent {
  @Input('label') label: string;
  @Output('fileChange') changeEmmit: EventEmitter<IFileInfo[]>;
  constructor(private eventBus: EventBusService) {
    this.changeEmmit = new EventEmitter();
  }
  /**
   * 添加文件
   */
  addFiles(input: HTMLInputElement) {
    const inputFiles = input.files;
    const files: IFileInfo[] = [];
    let isAllImage = true;
    for (let i = 0, lens = inputFiles.length; i < lens; i++) {
      const f = inputFiles[i];
      if (/^image/i.test(f.type)) {
        files.push({
          $uri: blobToBase64(f),
          originalname: f.name,
          mimetype: f.type,
          size: f.size,
          buffer: f,
        });
      } else {
        isAllImage = false;
      }
    }
    if (isAllImage) {
      this.changeEmmit.emit(files);
    } else {
      this.eventBus.emitTostMessage({
        type: ToastMessageType.error,
        message: '目前只支持图片文件',
      });
    }
  }
}
