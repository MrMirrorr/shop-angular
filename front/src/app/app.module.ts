import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainLayoutComponent } from './layouts';
import {
  ControlPanelComponent,
  HeaderComponent,
  FooterComponent,
  LoginFormComponent,
  RegistrationFormComponent,
  AddProductFormComponent,
  ProfileModalComponent,
} from './features';
import {
  CartComponent,
  HomeComponent,
  ProductDetailsComponent,
  NotFoundComponent,
  FavoritesComponent,
  ProductsListAdminComponent,
  OrdersComponent,
  UsersListAdminComponent,
} from './pages';
import {
  ProductListComponent,
  PaginatorComponent,
  ProductCardComponent,
  ConfirmDialogComponent,
  UserMiniAvatarComponent,
  CustomSnackbarComponent,
  AuthModalComponent,
  AddProductModalComponent,
} from './shared/components';
import { errorInterceptor } from './interceptors';
import { StopEventDirective } from './directives';

registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainLayoutComponent,
    HomeComponent,
    ProductDetailsComponent,
    ControlPanelComponent,
    FooterComponent,
    ProductListComponent,
    ProductCardComponent,
    PaginatorComponent,
    AuthModalComponent,
    UserMiniAvatarComponent,
    ConfirmDialogComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    CartComponent,
    CustomSnackbarComponent,
    NotFoundComponent,
    StopEventDirective,
    FavoritesComponent,
    ProductsListAdminComponent,
    AddProductFormComponent,
    AddProductModalComponent,
    UsersListAdminComponent,
    ProfileModalComponent,
    OrdersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatMenuModule,
    MatButtonToggleModule,
    MatTableModule,
    MatDividerModule,
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'ru' },
    provideHttpClient(withInterceptors([errorInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
