import { createAction, props } from '@ngrx/store';
import { ICategory } from 'app/shared/models/category.model';

export enum CategoryActionTypes {
  loadCategories = '[Category] Load Categories',
  loadCategoriesSuccess = '[Category] Load Categories Success',
  loadCategoriesFailure = '[Category] Load Categories Failure',
  setCategoryId = '[Category] Set CategoryId',
}

export const loadCategories = createAction(CategoryActionTypes.loadCategories);

export const loadCategoriesSuccess = createAction(
  CategoryActionTypes.loadCategoriesSuccess,
  props<{ categories: ICategory[] }>()
);

export const loadCategoriesFailure = createAction(
  CategoryActionTypes.loadCategoriesFailure,
  props<{ error: string }>()
);

export const setCategoryId = createAction(
  CategoryActionTypes.setCategoryId,
  props<{ selectedCategoryId: string }>()
);
