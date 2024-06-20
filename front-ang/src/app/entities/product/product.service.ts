import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IProductListObject,
  IProductObject,
} from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private readonly productUrl = `/api/products`;

  getProducts(params: string = '') {
    return this.http.get<IProductListObject>(`${this.productUrl}?${params}`);
  }

  getProductById(id: string) {
    return this.http.get<IProductObject>(`/api/products/${id}`);
  }
}
