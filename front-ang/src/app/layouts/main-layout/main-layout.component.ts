import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @Input() withControlPanel!: boolean;
}