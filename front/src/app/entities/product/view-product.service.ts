import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewProductService {
  private viewProductSubject = new BehaviorSubject<ViewType>('grid');
  viewProduct$ = this.viewProductSubject.asObservable();

  setView(view: ViewType): void {
    this.viewProductSubject.next(view);
  }
}

export type ViewType = 'grid' | 'list';
