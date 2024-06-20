import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaginateProductService {
  pageSizeOptions = [2, 4, 6];
  pageIndex = 0;
  pageSize = this.pageSizeOptions[0];

  pageChange$ = new Subject<{ pageIndex: number; pageSize: number }>();

  loadProducts(pageIndex: number, pageSize: number): void {
    this.pageChange$.next({ pageIndex, pageSize });
  }
}
