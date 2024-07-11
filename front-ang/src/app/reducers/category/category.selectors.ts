import { createFeatureSelector, createSelector } from '@ngrx/store';
import { categoryNode, ICategoryState } from './category.reducer';

export const selectCategoryFeature =
  createFeatureSelector<ICategoryState>(categoryNode);

export const selectCategories = createSelector(
  selectCategoryFeature,
  (state) => state.categories
);

export const selectSelectedCategoryId = createSelector(
  selectCategoryFeature,
  (state) => state.selectedCategoryId
);

export const selectIsLoading = createSelector(
  selectCategoryFeature,
  (state) => state.isLoading
);
