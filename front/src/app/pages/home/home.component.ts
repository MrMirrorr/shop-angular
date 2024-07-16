import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { PageEvent } from '@angular/material/paginator';
import { IProduct } from 'app/shared/models/product.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import {
  loadProducts,
  setPagination,
} from 'app/reducers/product/product.actions';
import {
  selectCount,
  selectIsLoading,
  selectPagination,
  selectProducts,
  selectSelectedCategoryId,
} from 'app/reducers/product/product.selectors';
import {
  IPageParams,
  pageSizeOptions,
} from 'app/shared/models/pagination.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

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
  count$: Observable<number> = this.store.select(selectCount);
  pageSizeOptions = pageSizeOptions;
  pagination$: Observable<IPageParams> = this.store.select(selectPagination);
  pagination!: IPageParams;

  ngOnInit() {
    this.pagination$.pipe(takeUntil(this.destroy$)).subscribe((pagination) => {
      this.pagination = pagination;
      this.store.dispatch(loadProducts());
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
