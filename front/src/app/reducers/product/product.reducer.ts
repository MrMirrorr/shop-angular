import { createReducer, on } from '@ngrx/store';
import { IProduct } from 'app/shared/models/product.model';
import {
  loadProducts,
  loadProductsFailure,
  loadProductsSuccess,
  resetPaginationPageIndex,
  setCategoryId,
  setIsLoading,
  setPagination,
  setSearchTerm,
  setSort,
  setViewMode,
} from './product.actions';
import { IPageParams } from 'app/shared/models/pagination.model';

export const productNode = 'product';

export interface IProductState {
  products: {
    products: IProduct<string>[] | [];
    count: number;
  };
  pagination: IPageParams;
  selectedCategoryId: string;
  searchTerm: string;
  viewMode: 'grid' | 'list';
  sort: 'asc' | 'desc';
  isLoading: boolean;
  error: any;
}

const initialState: IProductState = {
  products: {
    products: [],
    count: 0,
  },
  pagination: {
    pageIndex: 0,
    pageSize: 2,
  },
  selectedCategoryId: '',
  searchTerm: '',
  viewMode: 'grid',
  sort: 'asc',
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
  })),
  on(resetPaginationPageIndex, (state) => ({
    ...state,
    pagination: {
      ...state.pagination,
      pageIndex: 0,
    },
  })),

  on(setCategoryId, (state, { selectedCategoryId }) => ({
    ...state,
    selectedCategoryId,
  })),

  on(setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),

  on(setViewMode, (state, { viewMode }) => ({
    ...state,
    viewMode,
  })),

  on(setSort, (state, { sort }) => ({
    ...state,
    sort,
  })),

  on(setIsLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  }))
);
