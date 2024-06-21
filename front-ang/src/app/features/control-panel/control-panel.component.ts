import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import {
  SearchProductService,
  SortProductService,
  ViewProductService,
  ViewType,
} from 'app/entities/product';
import { CategoryService } from 'app/entities/category';
import { ICategory } from 'app/shared/models/category.model';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent implements OnInit {
  constructor(
    private readonly searchProductService: SearchProductService,
    private readonly sortProductService: SortProductService,
    private readonly categoryService: CategoryService,
    private readonly viewProductService: ViewProductService
  ) {}

  searchControl = new FormControl();
  selectedCategoryControl = new FormControl();

  categories: ICategory[] = [];
  isCategoriesLoading!: boolean;
  selectedCategory?: ICategory;

  viewProduct!: ViewType;

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.searchProductService.setSearchTerm(searchTerm);
      });

    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.categoryService.isLoading$.subscribe((isLoading) => {
      this.isCategoriesLoading = isLoading;
    });

    this.selectedCategoryControl.valueChanges.subscribe((selectedValue) => {
      this.categoryService.setSelectedCategory(selectedValue);
    });

    this.viewProductService.viewProduct$.subscribe((view) => {
      this.viewProduct = view;
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  openedChangeCategory(event: boolean) {
    if (event && !this.categoryService.getCategoriesValue().length) {
      this.categoryService.getCategories();
    }
  }

  onSort(event: MatButtonToggleChange) {
    this.sortProductService.setSort(event.value);
  }

  onView(event: MatButtonToggleChange) {
    this.viewProductService.setView(event.value);
  }
}
