export enum BusEventType {
  loading,
  headTitle,
  backButton,
  backButtonHandle,
  toastMessage,
}
export interface IBackBackButtonData {
  isShow?: boolean;
  isCustom?: boolean;
}
export interface IBusEvent<T> {
  type: BusEventType;
  token?: number;
  data: T;
}
