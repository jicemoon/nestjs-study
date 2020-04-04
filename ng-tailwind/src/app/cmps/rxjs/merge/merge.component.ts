import { interval, zip } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-merge',
  templateUrl: './merge.component.html',
  styleUrls: ['./merge.component.scss'],
})
export class MergeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    const $a = interval(2000).pipe(map(n => 'a => ' + +new Date() + '---' + n));
    const $b = interval(3000).pipe(map(n => 'b => ' + +new Date() + '---' + n));
    const $c = interval(1000).pipe(map(n => 'c => ' + +new Date() + '---' + n));

    zip($a, $b, $c).subscribe(console.log);
  }
}
