import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, finalize, takeUntil, tap } from 'rxjs';
import { ProductService } from 'app/entities/product';
import { CartService } from 'app/entities/cart';
import { IProduct, IProductComment } from 'app/shared/models/product.model';
import { SnackbarService } from 'app/shared/services';
import { AuthService } from 'app/entities/auth';
import { UserRoleEnum } from 'app/shared/models/auth.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/shared/components';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private snackbarService: SnackbarService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  private destroy$ = new Subject<void>();

  product!: IProduct<IProductComment>;
  isLoading = false;
  isAlreadyInCart!: boolean;
  commentFormControl = new FormControl('', [Validators.required]);
  userRole: UserRoleEnum = UserRoleEnum.Guest;

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

    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.userRole = user?.roleId;
      } else {
        this.userRole = UserRoleEnum.Guest;
      }
    });
  }

  onAddToCart() {
    this.cartService.addToCart({
      productId: this.product.id,
      quantity: 1,
    });
  }

  onCreateComment() {
    if (this.commentFormControl.valid) {
      this.productService
        .createComment(this.product.id, this.commentFormControl.value!)
        .subscribe(() => {
          this.snackbarService.showSnackbarSuccess('Комментарий добавлен');
          this.commentFormControl.reset();
          this.productService
            .getProductById(this.product.id)
            .subscribe((res) => {
              this.product = res.data;
            });
        });
    } else {
      this.commentFormControl.markAsTouched();
    }
  }

  onDeleteComment(commentId: string) {
    console.log(commentId);

    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Удаление',
        message: 'Вы уверены, что хотите удалить комментарий?',
        onConfirmAction: () => {
          this.productService
            .deleteComment(this.product.id, commentId)
            .pipe(tap(() => {}))
            .subscribe(() => {
              this.snackbarService.showSnackbarSuccess('Комментарий удален');
              this.productService
                .getProductById(this.product.id)
                .subscribe((res) => {
                  this.product = res.data;
                });
            });
        },
      },
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
