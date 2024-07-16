import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import { ICategory } from 'app/shared/models/category.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import {
  selectCategories,
  selectIsLoading,
} from 'app/reducers/category/category.selectors';
import { loadCategories } from 'app/reducers/category/category.actions';
import {
  selectSearchTerm,
  selectSelectedCategoryId,
  selectSort,
  selectViewMode,
} from 'app/reducers/product/product.selectors';
import {
  loadProducts,
  resetPaginationPageIndex,
  setCategoryId,
  setSearchTerm,
  setSort,
  setViewMode,
} from 'app/reducers/product/product.actions';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {
    this.store
      .select(selectSearchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchControl.setValue(searchTerm, { emitEvent: false });
      });

    this.store
      .select(selectCategories)
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  private destroy$ = new Subject<void>();

  @Input() controlPanelConfig: ControlPanelConfigType = {
    enabled: true,
    renderControls: {
      search: true,
      category: true,
      sort: true,
      view: true,
    },
  };

  searchControl = new FormControl();

  categories: ICategory[] = [];
  isCategoriesLoading$ = this.store.select(selectIsLoading);
  selectedCategoryId$ = this.store.select(selectSelectedCategoryId);
  viewMode$ = this.store.select(selectViewMode);
  sort$ = this.store.select(selectSort);

  ngOnInit(): void {
    // search
    this.searchControl.valueChanges
      .pipe(debounceTime(2000), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.store.dispatch(setSearchTerm({ searchTerm }));
        this.store.dispatch(resetPaginationPageIndex());
        this.store.dispatch(loadProducts());
      });
  }

  onOpenedChangeCategorySelect(event: boolean) {
    if (event && !this.categories.length) {
      this.store.dispatch(loadCategories());
    }
  }

  onCategoryChange(event: MatSelectChange) {
    this.store.dispatch(setCategoryId({ selectedCategoryId: event.value }));
    this.store.dispatch(resetPaginationPageIndex());
    this.store.dispatch(loadProducts());
  }

  onView(event: MatButtonToggleChange) {
    this.store.dispatch(setViewMode({ viewMode: event.value }));
  }

  onSort(event: MatButtonToggleChange) {
    this.store.dispatch(setSort({ sort: event.value }));
    this.store.dispatch(loadProducts());
  }

  trackById(index: number, item: ICategory): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
