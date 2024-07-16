import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ICartItem } from 'app/shared/models/cart.model';
import { CartService } from 'app/entities/cart';
import { AuthService } from 'app/entities/auth';
import { ConfirmDialogComponent } from 'app/shared/components';
import { SnackbarService } from 'app/shared/services';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import { OrderService } from 'app/entities/order';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private orderService: OrderService
  ) {}

  private destroy$ = new Subject<void>();

  controlPanelConfig: ControlPanelConfigType = {
    enabled: false,
  };

  displayedColumns: string[] = ['title', 'cost', 'quantity', 'sum', 'delete'];
  cartItems: ICartItem[] = [];
  isLoading = false;
  controlLoading = new Map<string, boolean>();

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.cartItems = items;
      });

    this.cartService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });

    // Редирект на главную страницу, если пользователь не авторизован
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!user) this.router.navigate(['/']);
    });
  }

  getTotalSum() {
    return this.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }

  onDecrementQuantity(productId: string, quantity: number) {
    this.setControlLoading(productId, true);

    this.cartService
      .decrementQuantityCartItem({ productId, quantity })
      .pipe(finalize(() => this.setControlLoading(productId, false)))
      .subscribe((res) => {
        const updatedCartItems = this.cartService.cartItemsSubject.value.map(
          (item) => {
            if (item.id === res.data.cartItem.id) {
              return res.data.cartItem;
            }
            return item;
          }
        );
        this.cartService.cartItemsSubject.next(updatedCartItems);
      });
  }

  onIncrementQuantity(productId: string, quantity: number) {
    this.setControlLoading(productId, true);

    this.cartService
      .incrementQuantityCartItem({ productId, quantity })
      .pipe(finalize(() => this.setControlLoading(productId, false)))
      .subscribe((res) => {
        const updatedCartItems = this.cartService.cartItemsSubject.value.map(
          (item) => {
            if (item.id === res.data.cartItem.id) {
              return res.data.cartItem;
            }
            return item;
          }
        );
        this.cartService.cartItemsSubject.next(updatedCartItems);
      });
  }

  onDeleteCartItem(cartItemId: string, productId: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Удаление',
        message: 'Вы уверены, что хотите удалить товар из корзины?',
        onConfirmAction: () => {
          this.setControlLoading(productId, true);

          this.cartService
            .deleteCartItem(cartItemId)
            .pipe(finalize(() => this.setControlLoading(productId, false)))
            .subscribe(() => {
              this.snackbarService.showSnackbarSuccess(
                'Товар удален из корзины'
              );
              this.cartService.getCart();
            });
        },
      },
    });
  }

  setControlLoading(productId: string, isLoading: boolean) {
    this.controlLoading.set(productId, isLoading);
  }

  isControlLoading(productId: string): boolean {
    return this.controlLoading.get(productId) || false;
  }

  onCreateOrder() {
    this.isLoading = true;
    this.orderService
      .createOrder({
        products: this.cartItems.map((item) => ({
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
        })),
        totalSum: this.getTotalSum(),
      })

      .subscribe(() => {
        this.snackbarService.showSnackbarSuccess('Заказ успешно создан');
        this.cartService
          .deleteAllCartItems(this.cartService.cartId)
          .subscribe(() => {
            this.cartService.getCart();
            this.router.navigate(['/orders']);
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
