export interface ICartObject {
  data: ICart;
  error: string | null;
}

export interface ICart {
  id: string;
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  id: string;
  cartId: string;
  product: ICartProduct;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartProduct {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}
