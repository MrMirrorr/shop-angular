import { Component, Input } from '@angular/core';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  @Input() products!: IProduct<string>[];
}
