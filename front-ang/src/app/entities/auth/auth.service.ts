import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import {
  ILoginCredentials,
  IRegistrationCredentials,
  IUser,
  IUserObject,
} from 'app/shared/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  private userSubject = new BehaviorSubject<IUser | null>(null);
  private isAuthMeLoadingSubject = new BehaviorSubject<boolean>(true);
  private isAuthLoadingSubject = new BehaviorSubject<boolean>(false);

  user$ = this.userSubject.asObservable();
  isAuthMeLoading$ = this.isAuthMeLoadingSubject.asObservable();
  isAuthLoading$ = this.isAuthLoadingSubject.asObservable();

  private readonly apiUrl = 'api/auth';

  authMe() {
    this.isAuthMeLoadingSubject.next(true);
    return this.http
      .get<IUserObject>(`${this.apiUrl}/me`)
      .pipe(finalize(() => this.isAuthMeLoadingSubject.next(false)))
      .subscribe((res) => {
        this.setUser(res.data);
      });
  }

  login(credentials: ILoginCredentials) {
    this.isAuthLoadingSubject.next(true);
    return this.http
      .post<IUserObject>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((res) => {
          this.setUser(res.data);
        }),
        finalize(() => {
          this.isAuthLoadingSubject.next(false);
        })
      );
  }

  registration(credentials: IRegistrationCredentials) {
    this.isAuthLoadingSubject.next(true);
    return this.http
      .post<IUserObject>(`${this.apiUrl}/register`, credentials)
      .pipe(
        tap((res) => {
          this.setUser(res.data);
        }),
        finalize(() => {
          this.isAuthLoadingSubject.next(false);
        })
      );
  }

  logout() {
    this.isAuthMeLoadingSubject.next(true);
    return this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      this.resetUser();
      this.isAuthMeLoadingSubject.next(false);
    });
  }

  setUser(user: IUser) {
    this.userSubject.next(user);
  }

  resetUser() {
    this.userSubject.next(null);
  }

  setIsAuthLoading(isLoading: boolean) {
    this.isAuthLoadingSubject.next(isLoading);
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}
