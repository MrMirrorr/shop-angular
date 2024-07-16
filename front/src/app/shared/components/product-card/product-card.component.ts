import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from 'app/entities/cart';
import { ViewType } from 'app/entities/product';
import { IProduct } from 'app/shared/models/product.model';
import { FavoriteService } from 'app/entities/favorite';

@Component({
  selector: 'app-product-card[product][viewProduct]',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit, OnDestroy {
  constructor(
    private readonly cartService: CartService,
    private favoriteService: FavoriteService
  ) {}

  private destroy$ = new Subject<void>();

  @Input() product!: IProduct<string>;
  @Input() viewProduct!: ViewType | null;
  isAlreadyInCart!: boolean;
  isAlreadyInFavorite!: boolean;

  ngOnInit(): void {
    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        this.isAlreadyInCart = items.some(
          (item) => item.product.id === this.product.id
        );
      });

    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites) => {
        this.isAlreadyInFavorite = favorites.some(
          (favorite) => favorite.id === this.product.id
        );
      });
  }

  onAddToCart() {
    this.cartService.addToCart({
      productId: this.product.id,
      quantity: 1,
    });
  }

  onAddToFavorite() {
    this.favoriteService.addToFavorite(this.product.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
