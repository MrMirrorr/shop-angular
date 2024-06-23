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
  avatarUrl: string;
  roleId: number;
}
