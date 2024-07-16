import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Subject,
  combineLatest,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {
  ProductService,
  PaginateProductService,
  SearchProductService,
  SortProductService,
} from 'app/entities/product';
import { CategoryService } from 'app/entities/category';
import { IProduct } from 'app/shared/models/product.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private readonly productService: ProductService,
    private readonly searchProductService: SearchProductService,
    private readonly sortProductService: SortProductService,
    private readonly paginateProductService: PaginateProductService,
    private readonly categoryService: CategoryService
  ) {}

  private destroy$ = new Subject<void>();

  controlPanelConfig: ControlPanelConfigType = {
    enabled: true,
    renderControls: {
      search: true,
      category: true,
      sort: true,
      view: true,
    },
  };

  products: IProduct<string>[] = [];
  lastPage!: number;
  count!: number;
  isLoading = false;

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
