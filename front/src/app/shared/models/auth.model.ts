export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegistrationCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface IUserObject {
  data: IUser;
  error: string | null;
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roleId: number;
}

export enum UserRoleEnum {
  Admin = 0,
  User = 1,
  Guest = 2,
}

export interface IUsersObject {
  data: IUser[];
  error: string | null;
}

export interface IRoleObject {
  data: IRole[];
}
export interface IRole {
  id: number;
  name: string;
}
