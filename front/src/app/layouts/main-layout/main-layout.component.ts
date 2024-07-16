import { Component, Input } from '@angular/core';
import { ControlPanelConfigType } from 'app/shared/models/control-panel.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  @Input() controlPanelConfig!: ControlPanelConfigType;
}
