import { createReducer, on } from '@ngrx/store';
import { decrease, increase, reset, updatedAt } from './count.actions';

export const countNode = 'count';

export interface ICountState {
  count: number;
  updatedAt: number;
}

const initialState: ICountState = {
  count: 0,
  updatedAt: Date.now(),
};

export const countReducer = createReducer(
  initialState,
  on(increase, (state) => ({
    ...state,
    count: state.count + 1,
  })),
  on(decrease, (state) => ({
    ...state,
    count: state.count - 1,
  })),
  on(reset, (state) => ({
    ...state,
    count: 0,
  })),
  on(updatedAt, (state, { updatedAt }) => ({
    ...state,
    updatedAt,
  }))
);
