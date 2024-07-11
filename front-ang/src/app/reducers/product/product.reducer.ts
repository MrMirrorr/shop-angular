import { createReducer, on } from '@ngrx/store';
import { IProduct } from 'app/shared/models/product.model';
import {
  loadProducts,
  loadProductsFailure,
  loadProductsSuccess,
  setPagination,
} from './product.actions';

export const productNode = 'product';

export interface IProductState {
  products: {
    products: IProduct<string>[] | [];
    count: number;
    lastPage: number;
  };
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  isLoading: boolean;
  error: any;
}

const initialState: IProductState = {
  products: {
    products: [],
    count: 0,
    lastPage: 1,
  },
  pagination: {
    pageIndex: 0,
    pageSize: 2,
  },
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
  on(loadProductsSuccess, (state, payload) => ({
    ...state,
    products: {
      products: payload.products.data.products,
      count: payload.products.data.count,
      lastPage: payload.products.data.lastPage,
    },
    isLoading: false,
    error: null,
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(setPagination, (state, { pageIndex, pageSize }) => ({
    ...state,
    pagination: {
      pageIndex,
      pageSize,
    },
  }))
);
