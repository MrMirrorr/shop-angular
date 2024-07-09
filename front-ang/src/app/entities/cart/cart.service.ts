import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize } from 'rxjs';
import {
  ICartItem,
  ICartObject,
  INewCartItem,
  IUpdatedCartItemObject,
} from 'app/shared/models/cart.model';
import { SnackbarService } from 'app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  cartItemsSubject = new BehaviorSubject<ICartItem[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  cartItems$ = this.cartItemsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  cartId = '';

  private readonly cartUrl = `/api/cart`;
  private readonly cartItemsUrl = `/api/cart-items`;

  getCart() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ICartObject>(this.cartUrl)
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((res) => {
        this.cartId = res.data.id;
        this.cartItemsSubject.next(res.data.items);
      });
  }

  addToCart(newCartItem: INewCartItem) {
    this.http.post(this.cartItemsUrl, newCartItem).subscribe(() => {
      this.snackbarService.showSnackbarSuccess('Товар добавлен в корзину');
      this.getCart();
    });
  }

  decrementQuantityCartItem(cartItem: INewCartItem) {
    const decrementedCartItem = {
      ...cartItem,
      quantity: -1,
    };

    return this.http.post<IUpdatedCartItemObject>(
      this.cartItemsUrl,
      decrementedCartItem
    );
  }

  incrementQuantityCartItem(cartItem: INewCartItem) {
    const incrementedCartItem = {
      ...cartItem,
      quantity: 1,
    };

    return this.http.post<IUpdatedCartItemObject>(
      this.cartItemsUrl,
      incrementedCartItem
    );
  }

  deleteCartItem(cartItemId: string) {
    return this.http.delete(`${this.cartItemsUrl}/${cartItemId}`);
  }

  deleteAllCartItems(cartId: string) {
    return this.http.delete(`${this.cartItemsUrl}/cart/${cartId}`);
  }

  get cartItemsCount(): number {
    return this.cartItemsSubject.value.length;
  }
}
