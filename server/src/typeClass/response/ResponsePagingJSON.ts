export interface IPageData {
  /**
   * 每页数量
   */
  pageSize: number;
  /**
   * 当前页码
   */
  pageIndex: number;
  /**
   * 总条数
   */
  total: number;
  /**
   * 是否为最后一页
   */
  isEnd?: boolean;
}

export class ResponsePagingJSON<T> {
  constructor(public pageData: IPageData = {pageSize: 15, pageIndex: 1, total: 0, isEnd: false}, public dataList: T[]) {
    this.pageData.pageSize = pageData.pageSize || 15;
    this.pageData.pageIndex = pageData.pageIndex || 1;
    this.pageData.total = pageData.total || 0;
  }
}
