import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginatorService {
  private pageIndex = new BehaviorSubject<number>(0);
  private pageSize = new BehaviorSubject<number>(10);

  setPageIndex(index: number) {
    this.pageIndex.next(index);
  }

  setPageSize(size: number) {
    this.pageSize.next(size);
  }

  getPageIndex() {
    return this.pageIndex.asObservable();
  }

  getPageSize() {
    return this.pageSize.asObservable();
  }
}
