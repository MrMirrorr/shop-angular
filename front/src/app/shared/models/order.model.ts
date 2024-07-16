import { IUser } from './auth.model';

export interface IOrdersObject {
  data: IOrder[];
  error: string | null;
}

export interface IOrder {
  id: string;
  products: IProductInOrder[];
  totalSum: number;
  user: IUser;
  createdAt: Date;
}

interface IProductInOrder {
  id: string;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ICreateOrderData {
  products: IProductInOrder[];
  totalSum: number;
}
