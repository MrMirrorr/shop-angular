import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
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
import {
  loadProducts,
  setPagination,
} from 'app/reducers/product/product.actions';
import {
  selectCount,
  selectIsLoading,
  selectLastPage,
  selectPagination,
  selectProducts,
} from 'app/reducers/product/product.selectors';
import { selectSelectedCategoryId } from 'app/reducers/category/category.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
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

  products$: Observable<IProduct<string>[]> = this.store.select(selectProducts);
  isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
  lastPage$: Observable<number> = this.store.select(selectLastPage);
  count$: Observable<number> = this.store.select(selectCount);
  pageSizeOptions = this.paginateProductService.pageSizeOptions;
  pagination$: Observable<{ pageIndex: number; pageSize: number }> =
    this.store.select(selectPagination);
  pagination!: { pageIndex: number; pageSize: number };
  selectedCategoryId$ = this.store.select(selectSelectedCategoryId);

  async ngOnInit() {
    combineLatest([this.pagination$, this.selectedCategoryId$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([pagination, selectedCategoryId]) => {
        this.store.dispatch(
          loadProducts({
            params: `page=${pagination.pageIndex + 1}&limit=${
              pagination.pageSize
            }&category=${selectedCategoryId || ''}`,
          })
        );
      });

    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      this.pagination = pagination;
    });
  }

  onPageChange(event: PageEvent): void {
    let pageIndex = event.pageIndex;
    if (event.pageSize < this.pagination.pageSize) pageIndex = 0;
    this.store.dispatch(setPagination({ pageIndex, pageSize: event.pageSize }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
