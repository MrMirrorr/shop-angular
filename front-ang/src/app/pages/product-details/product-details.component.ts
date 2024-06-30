import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, takeUntil, tap } from 'rxjs';
import { ProductService } from 'app/entities/product';
import { CartService } from 'app/entities/cart';
import { IProduct, IProductComment } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private readonly cartService: CartService
  ) {}

  private destroy$ = new Subject<void>();

  product!: IProduct<IProductComment>;
  isLoading = false;
  isAlreadyInCart!: boolean;

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id') as string;
    this.isLoading = true;
    this.productService
      .getProductById(productId)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe((res) => {
        this.product = res.data;
        this.isAlreadyInCart = this.cartService.cartItemsSubject.value.some(
          (item) => item.product.id === this.product.id
        );
      });

    this.cartService.cartItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe((items) => {
        if (this.product) {
          this.isAlreadyInCart = items.some(
            (item) => item.product.id === this.product.id
          );
        }
      });
  }

  onAddToCart() {
    this.cartService.addToCart({
      productId: this.product.id,
      quantity: 1,
    });
  }

  trackById(index: number, item: IProductComment) {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
