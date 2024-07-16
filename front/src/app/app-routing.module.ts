import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CartComponent,
  FavoritesComponent,
  HomeComponent,
  NotFoundComponent,
  OrdersComponent,
  ProductDetailsComponent,
  ProductsListAdminComponent,
  UsersListAdminComponent,
} from './pages';
import { adminGuard, authGuard } from './guards';

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
    title: 'Моя корзина',
    component: CartComponent,
    canActivate: [authGuard],
  },
  {
    path: 'favorites',
    title: 'Избранные товары',
    component: FavoritesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    title: 'Мои заказы',
    component: OrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'products-list-admin',
    title: 'Админка - Все товары',
    component: ProductsListAdminComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'users-list-admin',
    title: 'Админка - Все пользователи',
    component: UsersListAdminComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
