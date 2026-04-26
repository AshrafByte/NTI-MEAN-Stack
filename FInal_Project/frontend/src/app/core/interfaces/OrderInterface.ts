export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  country?: string;
}

export interface OrderInterface {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  cartItems: OrderItem[];
}

export interface OrderResponse {
  status: string;
  data: {
    order: OrderInterface;
  };
}

export interface OrdersResponse {
  status: string;
  results: number;
  data: {
    orders: OrderInterface[];
  };
}
