import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IProductListObject,
  IProductObject,
  NewProductType,
} from 'app/shared/models/product.model';

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

  createComment(productId: string, comment: string) {
    return this.http.post(`/api/products/${productId}/comments/`, {
      content: comment,
    });
  }

  deleteComment(productId: string, commentId: string) {
    return this.http.delete(
      `${this.productUrl}/${productId}/comments/${commentId}`
    );
  }

  createProduct(product: IProductObject) {
    return this.http.post<IProductObject>(this.productUrl, product);
  }

  updateProduct(productId: string, product: NewProductType) {
    return this.http.patch<IProductObject>(
      `${this.productUrl}/${productId}`,
      product
    );
  }

  deleteProduct(productId: string) {
    return this.http.delete(`${this.productUrl}/${productId}`);
  }
}
