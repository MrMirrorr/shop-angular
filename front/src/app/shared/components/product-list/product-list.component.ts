import { Component, Input } from '@angular/core';
import { IProduct } from 'app/shared/models/product.model';
import { Store } from '@ngrx/store';
import { selectViewMode } from 'app/reducers/product/product.selectors';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  constructor(private store: Store) {}

  @Input() products!: IProduct<string>[];
  viewMode$ = this.store.select(selectViewMode);

  trackById(index: number, item: IProduct<string>): string {
    return item.id;
  }
}
