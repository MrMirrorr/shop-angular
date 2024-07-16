import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  title = '404';
  message = 'Упс! Страница, которую вы ищете, не существует!';
  linkText = 'Вернуться На Главную';
  redirectPath = '/';
}
