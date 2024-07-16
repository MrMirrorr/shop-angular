import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IRoleObject,
  IUser,
  IUserObject,
  IUsersObject,
} from 'app/shared/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private readonly userUrl = '/api/users';

  getUsers() {
    return this.http.get<IUsersObject>(this.userUrl);
  }

  getRoles() {
    return this.http.get<IRoleObject>(`${this.userUrl}/roles`);
  }

  updateUserRole(userId: string, roleId: number) {
    return this.http.patch<IUserObject>(`${this.userUrl}/${userId}/role`, {
      roleId,
    });
  }

  deleteUser(userId: string) {
    return this.http.delete(`${this.userUrl}/${userId}`);
  }

  updateUser(user: IUser) {
    return this.http.patch<IUserObject>(`${this.userUrl}/user`, user);
  }
}
