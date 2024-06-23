import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
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
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainLayoutComponent } from './layouts';
import {
  ControlPanelComponent,
  HeaderComponent,
  FooterComponent,
  AuthModalComponent,
  LoginFormComponent,
  RegistrationFormComponent,
} from './features';
import { HomeComponent, ProductDetailsComponent } from './pages';
import {
  ProductListComponent,
  PaginatorComponent,
  ProductCardComponent,
  ConfirmDialogComponent,
  UserMiniAvatarComponent,
} from './shared/components';

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
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
