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
import { AuthService } from 'app/entities/auth';
import { IProduct } from 'app/shared/models/product.model';
import { UserRoleEnum } from 'app/shared/models/auth.model';
import {
  PaginateProductService,
  ProductService,
  SearchProductService,
  SortProductService,
} from 'app/entities/product';
import { CategoryService } from 'app/entities/category';
import { PageEvent } from '@angular/material/paginator';

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
    private sortProductService: SortProductService
  ) {}

  private destroy$ = new Subject<void>();

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
    combineLatest([
      this.searchProductService.searchTerm$.pipe(distinctUntilChanged()),
      this.categoryService.selectedCategory$.pipe(distinctUntilChanged()),
    ])
      .pipe(
        switchMap(([searchTerm, selectedCategory]) => {
          this.paginateProductService.resetPageIndex(
            this.paginateProductService.getPageParams().pageSize
          );

          return combineLatest([
            this.paginateProductService.pageParams$,
            this.sortProductService.sortProduct$,
          ]).pipe(
            tap(() => (this.isLoading = true)),
            switchMap(([params, sort]) => {
              const queryParams = `page=${params.pageIndex + 1}&limit=${
                params.pageSize
              }&sort=${sort}&search=${searchTerm}&category=${
                selectedCategory || ''
              }`;

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
    console.log('Edit product with id:', productId);
  }

  onDeleteProduct(productId: string) {
    console.log('Delete product with id:', productId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
