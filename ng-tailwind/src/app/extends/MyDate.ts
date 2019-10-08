export class MyDate extends Date {
  format(str: string = 'yyyy-mm-dd hh:MM:ss') {
    const y = ('' + this.getFullYear()).padStart(4, '0');
    const m = ('' + this.getMonth()).padStart(2, '0');
    const d = ('' + this.getDate()).padStart(2, '0');
    const h = ('' + this.getHours()).padStart(2, '0');
    const M = ('' + this.getMinutes()).padStart(2, '0');
    const s = ('' + this.getSeconds()).padStart(2, '0');

    return str
      .replace(/y+/i, y)
      .replace(/m+/, m)
      .replace(/d+/i, d)
      .replace(/h+/i, h)
      .replace(/M+/, M)
      .replace(/s+/i, s);
  }
}
