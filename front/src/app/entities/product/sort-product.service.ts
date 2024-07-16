import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SortProductService {
  private sortProductSubject = new BehaviorSubject<SortType>('asc');
  sortProduct$ = this.sortProductSubject.asObservable();

  setSort(sort: SortType): void {
    this.sortProductSubject.next(sort);
  }
}

export type SortType = 'asc' | 'desc';
