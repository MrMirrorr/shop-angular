import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginateProductService {
  pageSizeOptions = [2, 4, 6];
  private pageParamsSubject = new BehaviorSubject<IPageParams>({
    pageIndex: 0,
    pageSize: this.pageSizeOptions[0],
  });

  pageParams$ = this.pageParamsSubject.asObservable();

  setPageParams(params: IPageParams): void {
    this.pageParamsSubject.next(params);
  }

  resetPageIndex(pageSize: number): void {
    this.pageParamsSubject.next({
      pageIndex: 0,
      pageSize,
    });
  }

  getPageParams() {
    return this.pageParamsSubject.value;
  }
}

interface IPageParams {
  pageIndex: number;
  pageSize: number;
}
