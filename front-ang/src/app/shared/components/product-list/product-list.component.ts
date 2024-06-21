import { Component, Input, OnInit } from '@angular/core';
import { ViewProductService, ViewType } from 'app/entities/product';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  constructor(private readonly viewProductService: ViewProductService) {}

  @Input() products!: IProduct<string>[];
  viewProduct!: ViewType;

  ngOnInit() {
    this.viewProductService.viewProduct$.subscribe((view) => {
      this.viewProduct = view;
    });
  }

  trackById(index: number, item: IProduct<string>): string {
    return item.id;
  }
}
