export interface Order {
  id: string;
  status: number;
  observation: string;
  createdAt?: Date;
  updatedAt?: Date;

  restaurant?: any;
  restaurantId?: any;
  customer?: any;
  customerId?: any;
  orderItems: any[];
  orderPromotions: any[];
}
