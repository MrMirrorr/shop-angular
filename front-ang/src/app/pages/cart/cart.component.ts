import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ICartItem } from 'app/shared/models/cart.model';
import { CartService } from 'app/entities/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService) {}

  displayedColumns: string[] = ['title', 'cost', 'quantity', 'sum', 'delete'];
  cartItems: ICartItem[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;

    this.cartService
      .getCart()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((cart) => {
        this.cartItems = cart.data.items;
      });
  }

  getTotalSum() {
    return this.cartItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }
}
