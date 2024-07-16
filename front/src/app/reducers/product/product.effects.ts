import { Injectable } from '@angular/core';
import { catchError, exhaustMap, filter, map, of, withLatestFrom } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from 'app/entities/product';
import {
  loadProducts,
  loadProductsFailure,
  loadProductsSuccess,
  resetPaginationPageIndex,
  setCategoryId,
} from './product.actions';
import { Store } from '@ngrx/store';
import {
  selectPagination,
  selectSearchTerm,
  selectSelectedCategoryId,
  selectSort,
} from './product.selectors';
import { IPageParams } from 'app/shared/models/pagination.model';

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private productService: ProductService
  ) {
    this.pagination$.subscribe((pagination) => (this.pagination = pagination));
    this.categoryId$.subscribe((categoryId) => (this.categoryId = categoryId));
    this.searchTerm$.subscribe((searchTerm) => (this.searchTerm = searchTerm));
    this.sort$.subscribe((sort) => (this.sort = sort));
  }

  private pagination$ = this.store.select(selectPagination);
  private pagination!: IPageParams;
  private categoryId$ = this.store.select(selectSelectedCategoryId);
  private categoryId!: string;
  private searchTerm$ = this.store.select(selectSearchTerm);
  private searchTerm!: string;
  private sort$ = this.store.select(selectSort);
  private sort!: 'asc' | 'desc';

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      exhaustMap(() => {
        return this.productService
          .getProducts(
            `page=${this.pagination.pageIndex + 1}&limit=${
              this.pagination.pageSize
            }&category=${this.categoryId}&search=${this.searchTerm}&sort=${
              this.sort
            }`
          )
          .pipe(
            map((result) => loadProductsSuccess({ products: result })),
            catchError(() =>
              of(
                loadProductsFailure({
                  error: 'Не удалось получить список товаров',
                })
              )
            )
          );
      })
    )
  );
}
