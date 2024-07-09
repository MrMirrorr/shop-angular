import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { countNode, countReducer, ICountState } from './count/count.reducer';
import {
  IProductState,
  productNode,
  productReducer,
} from './product/product.reducer';

export interface IGlobalState {
  [countNode]: ICountState;
  [productNode]: IProductState;
}

export const reducers: ActionReducerMap<IGlobalState> = {
  [countNode]: countReducer,
  [productNode]: productReducer,
};

export const metaReducers: MetaReducer<IGlobalState>[] = isDevMode() ? [] : [];
