import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {
  isLoginForm = true;

  toggleFormType(): void {
    this.isLoginForm = !this.isLoginForm;
  }
}
