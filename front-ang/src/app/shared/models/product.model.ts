export interface IProductListObject {
  data: {
    lastPage: number;
    products: IProduct<string>[];
    count: number;
  };
  error: string | null;
}

export interface IProductObject {
  data: IProduct<IProductComment>;
  error: string | null;
}

export interface IProduct<T> {
  id: string;
  title: string;
  categoryId: string;
  price: number;
  amount: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  comments: T[];
}

export interface IProductComment {
  id: string;
  content: string;
  author: string;
  avatarUrl?: string;
  createdAt: string;
}
