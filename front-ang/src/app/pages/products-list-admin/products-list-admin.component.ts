import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Subject,
  combineLatest,
  distinctUntilChanged,
  finalize,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { IProduct } from 'app/shared/models/product.model';
import { UserRoleEnum } from 'app/shared/models/auth.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import { AuthService } from 'app/entities/auth';
import {
  PaginateProductService,
  ProductService,
  SearchProductService,
} from 'app/entities/product';
import { CategoryService } from 'app/entities/category';
import {
  AddProductModalComponent,
  ConfirmDialogComponent,
} from 'app/shared/components';
import { SnackbarService } from 'app/shared/services';

@Component({
  selector: 'app-products-list-admin',
  templateUrl: './products-list-admin.component.html',
  styleUrl: './products-list-admin.component.scss',
})
export class ProductsListAdminComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private searchProductService: SearchProductService,
    private categoryService: CategoryService,
    private paginateProductService: PaginateProductService,
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

  products: IProduct<string>[] = [];
  isLoading = false;

  lastPage!: number;
  count!: number;

  pageSizeOptions = this.paginateProductService.pageSizeOptions;
  pageIndex!: number;
  pageSize!: number;

  ngOnInit(): void {
    this.initProducts();

    // Редирект на главную страницу, если пользователь не авторизован
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (!user || user.roleId !== UserRoleEnum.Admin)
        this.router.navigate(['/']);
    });
  }

  onPageChange(event: PageEvent): void {
    if (
      event.pageSize !== this.paginateProductService.getPageParams().pageSize
    ) {
      this.paginateProductService.resetPageIndex(event.pageSize);
    } else {
      this.paginateProductService.setPageParams({
        pageIndex: event.pageIndex,
        pageSize: event.pageSize,
      });
    }
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
          this.isLoading = true;
          this.productService
            .deleteProduct(productId)
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe(() => {
              this.snackBarService.showSnackbarSuccess(
                'Товар успешно добавлен'
              );
              this.updateProducts();
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

  private initProducts() {
    combineLatest([
      this.searchProductService.searchTerm$.pipe(distinctUntilChanged()),
      this.categoryService.selectedCategory$.pipe(distinctUntilChanged()),
    ])
      .pipe(
        switchMap(([searchTerm, selectedCategory]) => {
          this.paginateProductService.resetPageIndex(
            this.paginateProductService.getPageParams().pageSize
          );

          return combineLatest([this.paginateProductService.pageParams$]).pipe(
            tap(() => (this.isLoading = true)),
            switchMap(([params]) => {
              const queryParams = `page=${params.pageIndex + 1}&limit=${
                params.pageSize
              }&search=${searchTerm}&category=${selectedCategory || ''}`;

              return this.productService.getProducts(queryParams);
            })
          );
        }),

        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.products = res.data.products;
          this.lastPage = res.data.lastPage;
          this.count = res.data.count;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });

    this.paginateProductService.pageParams$
      .pipe(
        tap((params) => {
          this.pageIndex = params.pageIndex;
          this.pageSize = params.pageSize;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private updateProducts() {
    this.paginateProductService.pageParams$
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap((params) => {
          const queryParams = `page=${params.pageIndex + 1}&limit=${
            params.pageSize
          }&search=${this.searchProductService.getSearchTerm()}&category=${
            this.categoryService.getSelectedCategory() || ''
          }`;

          return this.productService.getProducts(queryParams);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.products = res.data.products;
          this.lastPage = res.data.lastPage;
          this.count = res.data.count;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
  }
}
