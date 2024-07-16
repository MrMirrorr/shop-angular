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

export const selectPagination = createSelector(
  selectProductFeature,
  (state) => state.pagination
);

export const selectSelectedCategoryId = createSelector(
  selectProductFeature,
  (state) => state.selectedCategoryId
);

export const selectSearchTerm = createSelector(
  selectProductFeature,
  (state) => state.searchTerm
);

export const selectViewMode = createSelector(
  selectProductFeature,
  (state) => state.viewMode
);

export const selectIsLoading = createSelector(
  selectProductFeature,
  (state) => state.isLoading
);

export const selectSort = createSelector(
  selectProductFeature,
  (state) => state.sort
);
