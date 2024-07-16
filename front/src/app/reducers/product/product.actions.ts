import { createAction, props } from '@ngrx/store';
import { IPageParams } from 'app/shared/models/pagination.model';
import { IProductListObject } from 'app/shared/models/product.model';

export enum ProductActionTypes {
  loadProducts = '[Product] Load Products',
  loadProductsSuccess = '[Product] Load Products Success',
  loadProductsFailure = '[Product] Load Products Failure',
  setPagination = '[Product] Set Pagination',
  resetPagination = '[Product] Reset Pagination Page Index',
  setCategoryId = '[Product] Set CategoryId',
  setSearchTerm = '[Product] Set Search Term',
  setViewMode = '[Product] Set View Mode',
  setSort = '[Product] Set Sort',
  setIsLoading = '[Product] Set Is Loading',
}

export interface productsParams {
  page: string;
  limit: string;
  category: string;
  search: string;
  sort: 'asc' | 'desc';
}

export const loadProducts = createAction(ProductActionTypes.loadProducts);
export const loadProductsSuccess = createAction(
  ProductActionTypes.loadProductsSuccess,
  props<{ products: IProductListObject }>()
);
export const loadProductsFailure = createAction(
  ProductActionTypes.loadProductsFailure,
  props<{ error: string }>()
);

export const setPagination = createAction(
  ProductActionTypes.setPagination,
  props<IPageParams>()
);

export const resetPaginationPageIndex = createAction(
  ProductActionTypes.resetPagination
);

export const setCategoryId = createAction(
  ProductActionTypes.setCategoryId,
  props<{ selectedCategoryId: string }>()
);

export const setSearchTerm = createAction(
  ProductActionTypes.setSearchTerm,
  props<{ searchTerm: string }>()
);

export const setViewMode = createAction(
  ProductActionTypes.setViewMode,
  props<{ viewMode: 'grid' | 'list' }>()
);

export const setSort = createAction(
  ProductActionTypes.setSort,
  props<{ sort: 'asc' | 'desc' }>()
);

export const setIsLoading = createAction(
  ProductActionTypes.setIsLoading,
  props<{ isLoading: boolean }>()
);
