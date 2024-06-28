import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ViewProductService, ViewType } from 'app/entities/product';
import { IProduct } from 'app/shared/models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  constructor(private readonly viewProductService: ViewProductService) {}

  private destroy$ = new Subject<void>();

  @Input() products!: IProduct<string>[];
  viewProduct!: ViewType;

  ngOnInit() {
    this.viewProductService.viewProduct$
      .pipe(takeUntil(this.destroy$))
      .subscribe((view) => {
        this.viewProduct = view;
      });
  }

  trackById(index: number, item: IProduct<string>): string {
    return item.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
