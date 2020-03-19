import { IResponseData } from '@app/models';

export const getErrorMsg = <T>(json: IResponseData<T>): string => {
  const msgs = json.message || json.error;
  let msg: string;
  if (Array.isArray(msgs)) {
    msg = msgs[0];
  } else {
    msg = msgs;
  }
  return msg;
};
