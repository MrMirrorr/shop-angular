import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize } from 'rxjs';
import {
  ICategory,
  ICategoryListObject,
} from 'app/shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  private categoriesSubject = new BehaviorSubject<ICategory[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  private selectedCategorySubject = new BehaviorSubject<string>('');

  categories$ = this.categoriesSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  selectedCategory$ = this.selectedCategorySubject.asObservable();
  previousCategory = '';

  private categoryUrl = `/api/categories`;

  getCategories() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ICategoryListObject>(this.categoryUrl)
      .pipe(finalize(() => this.isLoadingSubject.next(false)))
      .subscribe((res) => {
        this.categoriesSubject.next(res.data);
      });
  }

  getCategoriesValue(): ICategory[] {
    return this.categoriesSubject.getValue();
  }

  setSelectedCategory(category: string) {
    this.selectedCategorySubject.next(category);
  }

  // isLoadingValue(): boolean {
  //   return this.isLoadingSubject.getValue();
  // }

  // getSelectedCategoryValue(): string | null {
  //   return this.selectedCategorySubject.getValue();
  // }
}
