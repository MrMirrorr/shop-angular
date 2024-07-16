import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, finalize, forkJoin, takeUntil, tap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductService } from 'app/entities/product';
import { AddProductModalComponent } from 'app/shared/components';
import { capitalizeFirstLetter } from 'app/shared/helpers';
import { SnackbarService, UploadService } from 'app/shared/services';
import { CategoryService } from 'app/entities/category';
import { ICategory } from 'app/shared/models/category.model';
import { IProduct, IProductComment } from 'app/shared/models/product.model';

@Component({
  selector: 'app-add-product-form',
  templateUrl: './add-product-form.component.html',
  styleUrl: './add-product-form.component.scss',
})
export class AddProductFormComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private uploadService: UploadService,
    private productService: ProductService,
    private addProductModalRef: MatDialogRef<AddProductModalComponent>,
    private snackBarService: SnackbarService,
    private categoryService: CategoryService
  ) {
    this.addProductForm = this.fb.group({
      title: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      price: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      imageUrl: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  private destroy$ = new Subject<void>();

  @Input() productId!: string | null;
  product!: IProduct<IProductComment>;
  addProductForm!: FormGroup;
  categories: ICategory[] = [];
  isLoading = true;

  ngOnInit(): void {
    if (this.productId) {
      forkJoin({
        product: this.productService.getProductById(this.productId),
        categories: this.categoryService.getCategoriesObservable(),
      })
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isLoading = false))
        )
        .subscribe(({ product, categories }) => {
          this.product = product.data;
          this.categories = categories.data;

          this.addProductForm.patchValue({
            ...this.product,
            categoryId: this.product.categoryId,
          });
        });
    } else {
      this.categoryService
        .getCategoriesObservable()
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isLoading = false))
        )
        .subscribe((categories) => {
          this.categories = categories.data;
        });
    }
  }

  getErrorMessage(formControlName: string, formControlLabel: string): string {
    const control = this.addProductForm.get(formControlName);

    if (control?.hasError('required')) {
      return `Поле "${capitalizeFirstLetter(
        formControlLabel
      )}" обязательно для заполнения`;
    }
    return '';
  }

  onUploadInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    this.uploadService.uploadImage(file).subscribe((res) => {
      this.addProductForm.patchValue({ imageUrl: res.url });
    });
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      this.isLoading = true;

      if (this.productId) {
        this.productService
          .updateProduct(this.productId, this.addProductForm.value)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res) => {
            this.router.navigate(['/products', res.data.id]);
            this.snackBarService.showSnackbarSuccess('Товар успешно изменен');
            this.addProductModalRef.close();
          });
      } else {
        this.productService
          .createProduct(this.addProductForm.value)
          .pipe(finalize(() => (this.isLoading = false)))
          .subscribe((res) => {
            this.router.navigate(['/products', res.data.id]);
            this.snackBarService.showSnackbarSuccess('Товар успешно добавлен');
            this.addProductModalRef.close();
          });
      }
    }
  }

  trackById(index: number, item: ICategory): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
