import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProductService } from 'app/entities/product/product.service';
import { IProduct } from 'app/shared/models/product.model';
import { delay, finalize, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private readonly productService: ProductService) {}

  pageSizeOptions = [2, 4, 6];
  pageIndex = 0;
  pageSize = this.pageSizeOptions[0];

  products: IProduct<string>[] = [];
  isLoading = false;
  lastPage!: number;
  count!: number;

  ngOnInit(): void {
    this.loadProducts(this.pageIndex, this.pageSize);
  }

  loadProducts(pageIndex: number, pageSize: number): void {
    const queryParams = `page=${pageIndex + 1}&limit=${pageSize}`;

    this.productService
      .getProducts(queryParams)
      .pipe(
        tap(() => (this.isLoading = true)),
        delay(1000),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((res) => {
        this.products = res.data.products;
        this.lastPage = res.data.lastPage;
        this.count = res.data.count;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts(this.pageIndex, this.pageSize);
  }
}
