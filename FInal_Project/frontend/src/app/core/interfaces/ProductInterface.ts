export interface ProductInterface {
  id?: number | string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  category: string;
  onSale?: boolean;
  isNew?: boolean;
  image: string;
  stock: number;
  featured?: boolean;
  sellerId?: number | string;
}
