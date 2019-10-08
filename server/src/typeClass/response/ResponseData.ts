import { ResponseErrorType } from './ResponseErrorEvent';

export interface IResponseData<T> {
  status?: boolean;
  statusCode?: ResponseErrorType;
  error?: string|string[];
  message?: string|string[];
  data?: T;
}
export class ResponseData<T> implements IResponseData<T> {
  public status: boolean = true;
  public statusCode: ResponseErrorType = ResponseErrorType.no;
  public message: string|string[] = '';
  public data: T = null;
  public error: string|string[] = '';
  constructor(initData?: IResponseData<T>) {
    Object.assign(this, initData);
  }
}
