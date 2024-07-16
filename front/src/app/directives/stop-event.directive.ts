import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appStopEvent]',
})
export class StopEventDirective {
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
