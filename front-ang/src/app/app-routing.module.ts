import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CartComponent,
  FavoritesComponent,
  HomeComponent,
  NotFoundComponent,
  ProductDetailsComponent,
} from './pages';
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
  {
    path: 'favorites',
    title: 'Избранное',
    component: FavoritesComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
