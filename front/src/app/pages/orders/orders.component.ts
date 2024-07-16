import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderService } from 'app/entities/order';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import { IOrder } from 'app/shared/models/order.model';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit, OnDestroy {
  constructor(private orderService: OrderService) {}

  private destroy$ = new Subject<void>();

  controlPanelConfig: ControlPanelConfigType = { enabled: false };

  orders: IOrder[] = [];
  isLoading = false;
  displayedColumns: string[] = ['orderId', 'createdAt', 'totalSum'];
  productDisplayedColumns: string[] = [
    'productId',
    'title',
    'price',
    'quantity',
    'total',
  ];
  selectedOrder: any;

  selectOrder(order: any) {
    this.selectedOrder = order;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.orderService
      .getOrders()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((res) => {
        this.orders = res.data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
