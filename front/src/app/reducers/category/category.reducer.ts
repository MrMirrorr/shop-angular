import { createReducer, on } from '@ngrx/store';
import { ICategory } from 'app/shared/models/category.model';
import {
  loadCategories,
  loadCategoriesFailure,
  loadCategoriesSuccess,
} from './category.actions';

export const categoryNode = 'category';

export interface ICategoryState {
  categories: ICategory[];
  isLoading: boolean;
  error: any;
}

const initialState: ICategoryState = {
  categories: [],
  isLoading: true,
  error: null,
};

export const categoryReducer = createReducer(
  initialState,

  on(loadCategories, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    isLoading: false,
    error: null,
  })),
  on(loadCategoriesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
