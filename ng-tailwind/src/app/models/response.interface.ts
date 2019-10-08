export interface IResponseData<T> {
  status?: boolean;
  statusCode?: number;
  error?: string | string[];
  message?: string | string[];
  data?: T;
}
