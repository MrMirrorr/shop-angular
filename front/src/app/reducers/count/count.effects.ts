import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { countActionTypes, updatedAt } from './count.actions';

@Injectable()
export class CountEffects {
  constructor(private actions$: Actions) {}

  updatedAt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        countActionTypes.increase,
        countActionTypes.decrease,
        countActionTypes.reset
      ),
      map(() => updatedAt({ updatedAt: Date.now() }))
    )
  );
}
