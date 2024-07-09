import { Injectable } from '@angular/core';
import { catchError, EMPTY, exhaustMap, map, of } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProductService } from 'app/entities/product';
import {
  loadProducts,
  loadProductsFailure,
  loadProductsSuccess,
} from './product.actions';

@Injectable()
export class ProductEffects {
  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      exhaustMap(({ params }) =>
        this.productService.getProducts(params).pipe(
          map((result) =>
            loadProductsSuccess({ products: result.data.products })
          ),
          catchError(() =>
            of(
              loadProductsFailure({
                error: 'Не удалось получить список товаров',
              })
            )
          )
        )
      )
    )
  );
}
