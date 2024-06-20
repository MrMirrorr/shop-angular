import { Component, OnInit } from '@angular/core';
import { combineLatest, switchMap, tap } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { PaginateProductService } from 'app/entities/product/paginate-product.service';
import { ProductService } from 'app/entities/product/product.service';
import { SearchProductService } from 'app/entities/product/search-product.service';
import { IProduct } from 'app/shared/models/product.model';
import { CategoryService } from 'app/entities/category/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(
    private readonly productService: ProductService,
    private readonly searchProductService: SearchProductService,
    private readonly paginateProductService: PaginateProductService,
    private readonly categoryService: CategoryService
  ) {}
  products: IProduct<string>[] = [];
  lastPage!: number;
  count!: number;
  isLoading = false;

  pageSizeOptions = this.paginateProductService.pageSizeOptions;
  pageIndex = this.paginateProductService.pageIndex;
  pageSize = this.paginateProductService.pageSize;

  ngOnInit(): void {
    combineLatest([
      this.paginateProductService.pageChange$,
      this.searchProductService.searchTerm$,
      this.categoryService.selectedCategory$,
    ])
      .pipe(
        tap(() => (this.isLoading = true)),
        switchMap(([pageInfo, searchTerm, selectedCategory]) => {
          if (
            searchTerm !== this.searchProductService.previousSearchTerm ||
            selectedCategory !== this.categoryService.previousCategory
          ) {
            this.pageIndex = 0;
            this.searchProductService.previousSearchTerm = searchTerm;
            this.categoryService.previousCategory = selectedCategory;
          } else {
            this.pageIndex = pageInfo.pageIndex;
          }
          this.pageSize = pageInfo.pageSize;

          const queryParams = `page=${this.pageIndex + 1}&limit=${
            this.pageSize
          }&search=${searchTerm}&category=${selectedCategory}`;

          return this.productService.getProducts(queryParams);
        })
      )
      .subscribe((res) => {
        this.products = res.data.products;
        this.lastPage = res.data.lastPage;
        this.count = res.data.count;
        this.isLoading = false;
      });

    this.paginateProductService.loadProducts(this.pageIndex, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateProductService.loadProducts(this.pageIndex, this.pageSize);
  }
}
