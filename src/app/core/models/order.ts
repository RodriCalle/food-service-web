export interface Order {
  id: string;
  status: 'Created' | 'InProgress' | 'Delivered' | 'Canceled';
  observation: string;
  createdAt?: Date;
  updatedAt?: Date;

  restaurant?: any;
  restaurantId?: any;
  customer?: any;
  customerId?: any;
  orderItems: any[];
}
