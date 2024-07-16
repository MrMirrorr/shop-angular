import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IAddProductModalData } from './IAddProductModalData';

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrl: './add-product-modal.component.scss',
})
export class AddProductModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: string | null }
  ) {}
}
