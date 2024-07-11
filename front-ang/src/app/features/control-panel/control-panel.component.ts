import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  take,
  takeUntil,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import {
  SearchProductService,
  SortProductService,
  SortType,
  ViewProductService,
  ViewType,
} from 'app/entities/product';
import { CategoryService } from 'app/entities/category';
import { ICategory } from 'app/shared/models/category.model';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';
import {
  selectCategories,
  selectIsLoading,
  selectSelectedCategoryId,
} from 'app/reducers/category/category.selectors';
import {
  loadCategories,
  setCategoryId,
} from 'app/reducers/category/category.actions';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private readonly searchProductService: SearchProductService,
    private readonly sortProductService: SortProductService,
    private readonly categoryService: CategoryService,
    private readonly viewProductService: ViewProductService
  ) {}

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

  categories$ = this.store.select(selectCategories);
  categories: ICategory[] = [];
  isCategoriesLoading$ = this.store.select(selectIsLoading);
  selectedCategoryId$ = this.store.select(selectSelectedCategoryId);

  viewProduct!: ViewType;

  sortValue!: SortType;

  ngOnInit(): void {
    this.categories$.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      this.categories = categories;
    });

    // search
    this.searchControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        this.searchProductService.setSearchTerm(searchTerm);
      });

    this.searchProductService.searchTerm$
      .pipe(takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.searchControl.setValue(searchTerm);
      });

    // view
    this.viewProductService.viewProduct$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view) => {
        this.viewProduct = view;
      });

    // sort
    this.sortProductService.sortProduct$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sort) => {
        this.sortValue = sort;
      });
  }

  onOpenedChangeCategorySelect(event: boolean) {
    if (event && !this.categories.length) {
      this.store.dispatch(loadCategories());
    }
  }

  onCategoryChange(event: MatSelectChange) {
    this.store.dispatch(setCategoryId({ selectedCategoryId: event.value }));
  }

  onSort(event: MatButtonToggleChange) {
    this.sortProductService.setSort(event.value);
  }

  onView(event: MatButtonToggleChange) {
    this.viewProductService.setView(event.value);
  }

  trackById(index: number, item: ICategory): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
