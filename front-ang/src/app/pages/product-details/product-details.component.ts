import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'app/entities/product/product.service';
import { IProduct, IProductComment } from 'app/shared/models/product.model';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  product!: IProduct<IProductComment>;
  isLoading = false;

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id') as string;
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe((res) => {
      this.product = res.data;
      this.isLoading = false;
    });
  }
}
