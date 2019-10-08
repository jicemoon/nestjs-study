export enum BusEventType {
  headTitle,
}

export interface IBusEvent<T> {
  type: BusEventType;
  data: T;
}
