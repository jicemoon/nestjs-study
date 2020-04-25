import { EventBusService } from '@app/services/event-bus.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FileModalSubmitParm } from '@app/models/file-modal-submit-parm';
import { IFileInfo } from '@app/models';
import { blobToBase64 } from '@app/tools/utils';
import { MyDate } from '@app/extends/MyDate';
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
  /**
   * 剪切板或input:file选中的文件
   */
  @Input() set clipFiles(val: DataTransferItemList | IFileInfo[]) {
    if (Array.isArray(val)) {
      this.selectedFiles(val);
    } else {
      this.getClipDatas(val);
    }
  }
  /**
   * 原输入框中的文字
   */
  @Input()
  set message(val: string) {
    this.msg = val;
  }

  public files: IFileInfo[] = [];
  public msg: string = '';
  @Output('cancel')
  cancelEmmit: EventEmitter<string>;
  @Output('confirm')
  confirmEmmit: EventEmitter<FileModalSubmitParm>;

  constructor(private eventBus: EventBusService) {
    this.cancelEmmit = new EventEmitter<string>(false);
    this.confirmEmmit = new EventEmitter<FileModalSubmitParm>(false);
  }
  /**
   * 选中的文件
   */
  selectedFiles(files: IFileInfo[]) {
    if (this.files.length + files.length > MAX_FILE_COUNT) {
      this.eventBus.emitTostMessage({
        type: ToastMessageType.error,
        message: `最多只能挂载${MAX_FILE_COUNT}张图片`,
      });
    } else {
      this.files.push(...files);
    }
  }
  /**
   * 处理粘贴板中的数据
   */
  getClipDatas(items: DataTransferItemList) {
    if (!items || items.length === 0) {
      return;
    }
    const files: IFileInfo[] = [];
    for (let i = 0, lens = items.length; i < lens; i++) {
      const item = items[i];
      switch (item.kind) {
        case 'string':
          item.getAsString(str => {
            this.msg += str;
          });
          break;
        case 'file':
          const file = item.getAsFile();
          if (/^image/i.test(file.type)) {
            const exts = file.name.split('.');
            const dateStr = new MyDate().format('yyyymmddhhMMss');
            const originalname = `${dateStr}.${exts[exts.length - 1]}`;
            files.push({
              $uri: blobToBase64(file),
              originalname,
              mimetype: file.type,
              size: file.size,
              buffer: file,
            });
          }
          break;
      }
    }
    this.files.push(...files);
  }

  /**
   * 弹窗 点击'取消'
   */
  cancelHandle(evt: MouseEvent) {
    evt.stopPropagation();
    evt.preventDefault();
    this.cancelEmmit.emit(this.message);
    this.files = [];
    this.message = '';
  }
  /**
   * 弹窗 点击'确定'
   */
  confirmHandle(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
    this.confirmEmmit.emit({ msg: this.msg, files: this.files });
    this.msg = '';
    this.files = [];
  }
}
