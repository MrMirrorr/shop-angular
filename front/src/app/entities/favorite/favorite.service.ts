import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize } from 'rxjs';
import {
  IAddOrRemoveFavorite,
  IFavoriteObject,
} from 'app/shared/models/favorite.model';
import { IProduct } from 'app/shared/models/product.model';
import { SnackbarService } from 'app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  private favoritesSubject = new BehaviorSubject<IProduct<string>[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  favorites$ = this.favoritesSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly favoriteUrl = `/api/favorites`;

  getFavorites() {
    this.isLoadingSubject.next(true);
    this.http
      .get<IFavoriteObject>(this.favoriteUrl)
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((favorites) => {
        this.favoritesSubject.next(
          favorites.data.map((favorite) => favorite.product)
        );
      });
  }

  addToFavorite(productId: string) {
    this.http
      .post<IAddOrRemoveFavorite>(
        `${this.favoriteUrl}/product/${productId}`,
        {}
      )
      .subscribe((res) => {
        this.snackbarService.showSnackbarSuccess(
          res.operation === 'CREATE'
            ? 'Товар добавлен в избранное'
            : 'Товар удален из избранного'
        );
        this.getFavorites();
      });
  }
}
