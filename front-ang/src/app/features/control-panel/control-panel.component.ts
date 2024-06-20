import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryService } from 'app/entities/category/category.service';
import { SearchProductService } from 'app/entities/product/search-product.service';
import { ICategory } from 'app/shared/models/category.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
})
export class ControlPanelComponent implements OnInit {
  constructor(
    private readonly searchProductService: SearchProductService,
    private readonly categoryService: CategoryService
  ) {}

  searchControl = new FormControl();
  selectedCategoryControl = new FormControl();

  categories: ICategory[] = [];
  isCategoriesLoading!: boolean;
  selectedCategory?: ICategory;

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
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  openedChange(event: boolean) {
    if (event && !this.categoryService.getCategoriesValue().length) {
      this.categoryService.getCategories();
    }
  }
}
