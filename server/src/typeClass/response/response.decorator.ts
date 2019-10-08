import { ResponseData } from './ResponseData';
import { ResponseErrorEvent } from './ResponseErrorEvent';

export function ResponseDecorator<T>(successMsg?: string) {
  return (target, key, descriptor: PropertyDescriptor) => {
    const oldValue = descriptor.value;
    descriptor.value = async function() {
      const res = new ResponseData<T>();
      try {
        const data: T = await oldValue.apply(this, arguments);
        res.message = successMsg || '';
        res.data = data;
      } catch (evt) {
        res.status = false;
        if (evt instanceof ResponseErrorEvent) {
          const errorEvent = evt as ResponseErrorEvent;
          res.statusCode = errorEvent.error;
          res.error = errorEvent.msg;
        } else {
          res.error = evt;
        }
      }
      return res;
    };
    return descriptor;
  };
}
