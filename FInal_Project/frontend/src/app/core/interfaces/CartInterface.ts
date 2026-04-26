export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
