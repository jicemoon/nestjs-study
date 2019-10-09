export enum BusEventType {
  loading,
  headTitle,
}

export interface IBusEvent<T> {
  type: BusEventType;
  token?: number;
  data: T;
}
