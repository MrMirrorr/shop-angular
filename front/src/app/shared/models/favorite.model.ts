import { IProduct } from './product.model';

export interface IFavoriteObject {
  data: IFavorite[];
  error: string | null;
}

export interface IFavorite {
  id: string;
  product: IProduct<string>;
  createdAt: Date;
}

export interface IAddOrRemoveFavorite {
  operation: 'CREATE' | 'DELETE';
  data: IFavorite | null;
}
