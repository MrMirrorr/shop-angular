import { Injectable } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadCategories,
  loadCategoriesFailure,
  loadCategoriesSuccess,
} from './category.actions';
import { CategoryService } from 'app/entities/category';

@Injectable()
export class CategoryEffects {
  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {}

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategories),
      exhaustMap(() =>
        this.categoryService.getCategories().pipe(
          map((result) => loadCategoriesSuccess({ categories: result.data })),
          catchError(() =>
            of(
              loadCategoriesFailure({
                error: 'Не удалось получить список категорий',
              })
            )
          )
        )
      )
    )
  );
}
