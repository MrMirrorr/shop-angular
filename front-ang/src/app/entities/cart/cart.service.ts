import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICart, ICartObject } from 'app/shared/models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}

  private readonly cartUrl = `/api/cart`;

  getCart() {
    return this.http.get<ICartObject>(this.cartUrl);
  }
}
