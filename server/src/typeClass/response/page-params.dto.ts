export class PageParamsDto {
  /**
   * 每页显示条数
   */
  pageSize?: number = 20;
  /**
   * 当前页数, 默认为1
   */
  pageIndex?: number = 1;
  constructor(param: { pageIndex: number; pageSize: number }) {
    Object.assign(this, param);
  }
  static clone(param: PageParamsDto) {
    return new PageParamsDto({
      pageIndex: param.pageIndex,
      pageSize: param.pageSize,
    });
  }
}
