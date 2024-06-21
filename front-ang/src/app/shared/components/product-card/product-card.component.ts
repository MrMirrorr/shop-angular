import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ViewType } from 'app/entities/product';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-card[product][viewProduct]',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: IProduct<string>;
  @Input() viewProduct!: ViewType;
}
