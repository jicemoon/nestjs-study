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
export const TOAST_DURATION = 3000;
export class ToastMessage implements IToastMessage {
  type: ToastMessageType;
  duration?: number = TOAST_DURATION;
  message: string;
  constructor(
    message: string,
    type: ToastMessageType = ToastMessageType.info,
    duration: number = TOAST_DURATION,
  ) {
    this.message = message;
    this.type = type;
    this.duration = duration;
  }
}
