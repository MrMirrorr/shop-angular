import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    title: 'Все товары',
    component: HomeComponent,
  },
  {
    path: 'products/:id',
    title: 'Детальная информация',
    component: ProductDetailsComponent,
  },
  {
    path: 'cart',
    title: 'Корзина',
    component: CartComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
