import { createAction, props } from '@ngrx/store';

export enum countActionTypes {
  increase = '[Count] Increase',
  decrease = '[Count] Decrease',
  reset = '[Count] Reset',
  updatedAt = '[Count] Updated At',
}

export const increase = createAction(countActionTypes.increase);
export const decrease = createAction(countActionTypes.decrease);
export const reset = createAction(countActionTypes.reset);
export const updatedAt = createAction(
  countActionTypes.updatedAt,
  props<{ updatedAt: number }>()
);
