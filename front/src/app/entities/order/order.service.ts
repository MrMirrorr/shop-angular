import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateOrderData, IOrdersObject } from 'app/shared/models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  orderUrl = '/api/orders';

  getOrders() {
    return this.http.get<IOrdersObject>(this.orderUrl);
  }

  createOrder(orderData: ICreateOrderData) {
    return this.http.post(this.orderUrl, orderData);
  }
}
