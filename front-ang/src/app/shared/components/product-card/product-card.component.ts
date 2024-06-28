import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from 'app/entities/cart';
import { ViewType } from 'app/entities/product';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-card[product][viewProduct]',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnDestroy {
  constructor(private readonly cartService: CartService) {}

  private destroy$ = new Subject<void>();

  @Input() product!: IProduct<string>;
  @Input() viewProduct!: ViewType;
  iaAlreadyInCart!: boolean;

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.iaAlreadyInCart = items.some(
          (item) => item.product.id === this.product.id
        );
      });
  }

  onAddToCart() {
    this.cartService.addToCart({
      productId: this.product.id,
      quantity: 1,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
