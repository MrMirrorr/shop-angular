import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  CartComponent,
  FavoritesComponent,
  HomeComponent,
  NotFoundComponent,
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
