import { EventBusService } from './../../../services/event-bus.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileModalSubmitParm } from '@app/models/file-modal-submit-parm';
import { IFileInfo } from '@app/models';
import { blobToBase64 } from '@app/tools/utils';
import { ToastMessageType } from '@app/models/toastMessage';

/**
 * 目前支持的最多文件数量
 */
export const MAX_FILE_COUNT = 5;
@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.scss'],
})
export class FileModalComponent {
  @Input() files: IFileInfo[] = [];
  @Input()
  set msg(val: string) {
    this.message = val;
  }

  public message: string = '';
  @Output('cancel')
  cancelEmmit: EventEmitter<string>;
  @Output('confirm')
  confirmEmmit: EventEmitter<FileModalSubmitParm>;

  constructor(private eventBus: EventBusService) {
    this.cancelEmmit = new EventEmitter<string>(false);
    this.confirmEmmit = new EventEmitter<FileModalSubmitParm>(false);
  }

  cancelHandle(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    this.cancelEmmit.emit(this.msg);
  }
  confirmHandle(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    this.confirmEmmit.emit({ msg: this.message, files: this.files });
    this.message = '';
    this.files = [];
  }

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
      if (this.files.length + files.length > MAX_FILE_COUNT) {
        this.eventBus.emitTostMessage({
          type: ToastMessageType.error,
          message: `最多只能挂载${MAX_FILE_COUNT}张图片`,
        });
      } else {
        this.files.push(...files);
      }
    } else {
      this.eventBus.emitTostMessage({
        type: ToastMessageType.error,
        message: '目前只支持图片文件',
      });
    }
  }
  scrollHandle(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
  }
}
