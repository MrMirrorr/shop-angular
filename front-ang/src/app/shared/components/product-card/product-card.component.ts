import { Component, Input } from '@angular/core';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: IProduct<string>;
}
