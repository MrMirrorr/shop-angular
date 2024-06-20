import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductListObject } from '../../shared/models/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchProductService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();
  previousSearchTerm = '';

  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
}
