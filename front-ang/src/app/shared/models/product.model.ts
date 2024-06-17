export interface IProductListObject {
  data: {
    lastPage: number;
    products: IProduct<string>[];
  };
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
  author: any; // TODO: add author type
  createdAt: string;
}