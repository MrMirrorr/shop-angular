import { createAction, props } from '@ngrx/store';
import { IProduct } from 'app/shared/models/product.model';

export enum ProductActionTypes {
  loadProducts = '[Product] Load Products',
  loadProductsSuccess = '[Product] Load Products Success',
  loadProductsFailure = '[Product] Load Products Failure',
}

export const loadProducts = createAction(
  ProductActionTypes.loadProducts,
  props<{ params: string }>()
);

export const loadProductsSuccess = createAction(
  ProductActionTypes.loadProductsSuccess,
  props<{ products: IProduct<string>[] }>()
);

export const loadProductsFailure = createAction(
  ProductActionTypes.loadProductsFailure,
  props<{ error: string }>()
);
