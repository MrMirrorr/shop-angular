import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ICountState } from 'app/reducers/count/count.reducer';
import {
  selectCount,
  selectUpdatedAt,
} from 'app/reducers/count/count.selectors';
import { decrease, increase, reset } from 'app/reducers/count/count.actions';

@Component({
  selector: 'app-ngrx-test',
  templateUrl: './ngrx-test.component.html',
  styleUrl: './ngrx-test.component.scss',
})
export class NgrxTestComponent {
  count$: Observable<number> = this.store$.pipe(select(selectCount));
  updatedAt$: Observable<number> = this.store$.pipe(select(selectUpdatedAt));
  disableDecrease$: Observable<boolean> = this.count$.pipe(
    map((count) => count <= 0)
  );

  constructor(private store$: Store<ICountState>) {}

  increment() {
    this.store$.dispatch(increase());
  }

  decrement() {
    this.store$.dispatch(decrease());
  }

  reset() {
    this.store$.dispatch(reset());
  }
}
