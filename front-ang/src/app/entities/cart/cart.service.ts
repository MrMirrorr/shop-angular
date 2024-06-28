import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ICartItem,
  ICartObject,
  INewCartItem,
  IUpdatedCartItemObject,
} from 'app/shared/models/cart.model';
import { BehaviorSubject, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  private cartItemsSubject = new BehaviorSubject<ICartItem[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  cartItems$ = this.cartItemsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  private readonly cartUrl = `/api/cart`;
  private readonly cartItemsUrl = `/api/cart-items`;

  getCart() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ICartObject>(this.cartUrl)
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((res) => {
        this.cartItemsSubject.next(res.data.items);
      });
  }

  addToCart(newCartItem: INewCartItem) {
    this.http.post(this.cartItemsUrl, newCartItem).subscribe(() => {
      this.getCart();
    });
  }

  decrementQuantityCartItem(cartItem: INewCartItem) {
    const decrementedCartItem = {
      ...cartItem,
      quantity: -1,
    };

    this.http
      .post<IUpdatedCartItemObject>(this.cartItemsUrl, decrementedCartItem)
      .subscribe((res) => {
        const updatedCartItems = this.cartItemsSubject.value.map((item) => {
          if (item.id === res.data.cartItem.id) {
            return res.data.cartItem;
          }
          return item;
        });
        this.cartItemsSubject.next(updatedCartItems);
      });
  }

  incrementQuantityCartItem(cartItem: INewCartItem) {
    const incrementedCartItem = {
      ...cartItem,
      quantity: 1,
    };

    this.http
      .post<IUpdatedCartItemObject>(this.cartItemsUrl, incrementedCartItem)
      .subscribe((res) => {
        const updatedCartItems = this.cartItemsSubject.value.map((item) => {
          if (item.id === res.data.cartItem.id) {
            return res.data.cartItem;
          }
          return item;
        });
        this.cartItemsSubject.next(updatedCartItems);
      });
  }

  get cartItemsCount(): number {
    return this.cartItemsSubject.value.length;
  }
}
