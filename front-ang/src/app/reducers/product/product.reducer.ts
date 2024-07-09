import { createReducer, on } from '@ngrx/store';
import { IProduct } from 'app/shared/models/product.model';
import {
  loadProducts,
  loadProductsFailure,
  loadProductsSuccess,
} from './product.actions';

export const productNode = 'product';

export interface IProductState {
  products: IProduct<string>[];
  isLoading: boolean;
  error: any;
}

const initialState: IProductState = {
  products: [],
  isLoading: false,
  error: null,
};

export const productReducer = createReducer(
  initialState,

  on(loadProducts, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    isLoading: false,
    error: null,
  })),

  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
