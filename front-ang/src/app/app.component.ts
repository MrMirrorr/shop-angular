import { Component, OnInit } from '@angular/core';
import { AuthService } from './entities/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  isLoading!: boolean;

  ngOnInit(): void {
    this.authService.authMe();

    this.authService.isAuthMeLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }
}
