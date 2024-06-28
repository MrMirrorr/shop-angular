import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { ICartItem } from 'app/shared/models/cart.model';
import { CartService } from 'app/entities/cart';
import { AuthService } from 'app/entities/auth';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  private destroy$ = new Subject<void>();

  displayedColumns: string[] = ['title', 'cost', 'quantity', 'sum', 'delete'];
  cartItems: ICartItem[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.cartService
      .getCart()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((cart) => {
        this.cartItems = cart.data.items;
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
