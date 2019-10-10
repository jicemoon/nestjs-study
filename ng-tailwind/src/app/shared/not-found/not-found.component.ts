import { interval, Subscription } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// 此时间(秒)后自动跳转到首页
const AUTO_TIMEOUT = 6;
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit, OnDestroy {
  timeout$: Subscription;
  countdown: number = AUTO_TIMEOUT;
  constructor(private router: Router) {}

  ngOnInit() {
    this.timeout$ = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.timeout$.unsubscribe();
        this.router.navigate(['/']);
      }
    });
  }
  ngOnDestroy() {}
}
