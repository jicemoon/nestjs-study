export enum ToastMessageType {
  warn = 'warn',
  error = 'error',
  info = 'info',
  success = 'success',
}

export interface IToastMessage {
  type: ToastMessageType;
  message: string | string[];
}

export class ToastMessage implements IToastMessage {
  type: ToastMessageType;
  message: string;
  constructor(message: string, type: ToastMessageType = ToastMessageType.info) {
    this.message = message;
    this.type = type;
  }
}
