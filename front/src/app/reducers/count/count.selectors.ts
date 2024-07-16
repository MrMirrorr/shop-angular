import { createFeatureSelector, createSelector } from '@ngrx/store';
import { countNode, ICountState } from './count.reducer';

export const selectCountFeature = createFeatureSelector<ICountState>(countNode);

export const selectCount = createSelector(
  selectCountFeature,
  (state) => state.count
);

export const selectUpdatedAt = createSelector(
  selectCountFeature,
  (state) => state.updatedAt
);
