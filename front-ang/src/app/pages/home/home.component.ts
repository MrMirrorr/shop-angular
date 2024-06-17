import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/entities/product/product.service';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  constructor(private readonly productService: ProductService) {}

  products: IProduct<string>[] = [];
  lastPage!: number;

  ngOnInit(): void {
    this.productService.getProducts().subscribe((res) => {
      this.products = res.data.products;
      this.lastPage = res.data.lastPage;
    });
  }
}
