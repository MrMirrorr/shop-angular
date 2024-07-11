import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { countNode, countReducer, ICountState } from './count/count.reducer';
import {
  IProductState,
  productNode,
  productReducer,
} from './product/product.reducer';
import {
  categoryNode,
  categoryReducer,
  ICategoryState,
} from './category/category.reducer';

export interface IGlobalState {
  [countNode]: ICountState;
  [productNode]: IProductState;
  [categoryNode]: ICategoryState;
}

export const reducers: ActionReducerMap<IGlobalState> = {
  [countNode]: countReducer,
  [productNode]: productReducer,
  [categoryNode]: categoryReducer,
};

export const metaReducers: MetaReducer<IGlobalState>[] = isDevMode() ? [] : [];
