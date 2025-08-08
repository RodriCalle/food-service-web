export interface OrderItem {
  id: string;
  orderId: string;
  order?: any;
  productId: string;
  product?: any;
  quantity: number;
  unitPrice: number;
  total: number;
}
