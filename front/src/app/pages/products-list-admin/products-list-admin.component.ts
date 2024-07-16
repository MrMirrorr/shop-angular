import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { IProduct } from 'app/shared/models/product.model';
import { UserRoleEnum } from 'app/shared/models/auth.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import { AuthService } from 'app/entities/auth';
import { ProductService } from 'app/entities/product';
import {
  AddProductModalComponent,
  ConfirmDialogComponent,
} from 'app/shared/components';
import { SnackbarService } from 'app/shared/services';
import { Store } from '@ngrx/store';
import {
  selectCount,
  selectIsLoading,
  selectPagination,
  selectProducts,
} from 'app/reducers/product/product.selectors';
import {
  IPageParams,
  pageSizeOptions,
} from 'app/shared/models/pagination.model';
import {
  loadProducts,
  setIsLoading,
  setPagination,
} from 'app/reducers/product/product.actions';

@Component({
  selector: 'app-products-list-admin',
  templateUrl: './products-list-admin.component.html',
  styleUrl: './products-list-admin.component.scss',
})
export class ProductsListAdminComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store,
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBarService: SnackbarService
  ) {}

  private destroy$ = new Subject<void>();

  controlPanelConfig: ControlPanelConfigType = {
    enabled: true,
    renderControls: {
      search: true,
      category: true,
      sort: false,
      view: false,
    },
  };

  displayedColumns: string[] = [
    'id',
    'title',
    'category',
    'price',
    'amount',
    'image',
    'controls',
  ];

  products$: Observable<IProduct<string>[]> = this.store.select(selectProducts);
  isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
  count$: Observable<number> = this.store.select(selectCount);
  pageSizeOptions = pageSizeOptions;
  pagination$: Observable<IPageParams> = this.store.select(selectPagination);
  pagination!: IPageParams;

  ngOnInit(): void {
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      this.pagination = pagination;
      this.store.dispatch(loadProducts());
    });

    // Редирект на главную страницу, если пользователь не авторизован или не админ
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!user || user.roleId !== UserRoleEnum.Admin)
        this.router.navigate(['/']);
    });
  }

  onPageChange(event: PageEvent): void {
    let pageIndex = event.pageIndex;
    if (event.pageSize < this.pagination.pageSize) pageIndex = 0;
    this.store.dispatch(setPagination({ pageIndex, pageSize: event.pageSize }));
  }

  onEditProduct(productId: string) {
    this.dialog.open(AddProductModalComponent, {
      data: { productId },
    });
  }

  onDeleteProduct(productId: string) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Удаление',
        message: 'Вы уверены, что хотите удалить товар?',
        onConfirmAction: () => {
          this.store.dispatch(setIsLoading({ isLoading: true }));
          this.productService.deleteProduct(productId).subscribe(() => {
            this.snackBarService.showSnackbarSuccess('Товар успешно добавлен');
            this.store.dispatch(loadProducts());
          });
        },
      },
    });
  }

  onAddProduct() {
    this.dialog.open(AddProductModalComponent, {
      data: { productId: null },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
