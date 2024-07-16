import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-mini-avatar',
  templateUrl: './user-mini-avatar.component.html',
  styleUrl: './user-mini-avatar.component.scss',
})
export class UserMiniAvatarComponent {
  @Input() src?: string;
  @Input() alt?: string;
  @Input() class?: string;
  @Input() size?: number;
}
