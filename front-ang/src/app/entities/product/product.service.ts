import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductListObject } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  private productUrl = `/api/products`;

  getProducts(params: string = '') {
    return this.http.get<IProductListObject>(`${this.productUrl}?${params}`);
  }
}
