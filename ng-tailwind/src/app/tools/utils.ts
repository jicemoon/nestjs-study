import { Observable } from 'rxjs';
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

export function blobToBase64(blob: Blob) {
  return new Observable<string>(sub => {
    try {
      const reader = new FileReader();
      reader.onload = e => {
        sub.next(e.target.result as string);
        sub.complete();
      };
      reader.onerror = e => {
        sub.error(e);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      sub.error(e);
    }
  });
}
