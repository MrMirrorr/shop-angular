import { createAction, props } from '@ngrx/store';
import { IProductListObject } from 'app/shared/models/product.model';

export enum ProductActionTypes {
  loadProducts = '[Product] Load Products',
  loadProductsSuccess = '[Product] Load Products Success',
  loadProductsFailure = '[Product] Load Products Failure',
  setPagination = '[Product] Set Pagination',
}

export const loadProducts = createAction(
  ProductActionTypes.loadProducts,
  props<{ params: string }>()
);

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
  props<{ pageIndex: number; pageSize: number }>()
);
