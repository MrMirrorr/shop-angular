import { createFeatureSelector, createSelector } from '@ngrx/store';
import { productNode, IProductState } from './product.reducer';

export const selectProductFeature =
  createFeatureSelector<IProductState>(productNode);

export const selectProducts = createSelector(
  selectProductFeature,
  (state) => state.products.products
);

export const selectCount = createSelector(
  selectProductFeature,
  (state) => state.products.count
);

export const selectLastPage = createSelector(
  selectProductFeature,
  (state) => state.products.lastPage
);

export const selectPagination = createSelector(
  selectProductFeature,
  (state) => state.pagination
);

export const selectIsLoading = createSelector(
  selectProductFeature,
  (state) => state.isLoading
);
