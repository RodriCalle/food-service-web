export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: any;
  restaurant?: any;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  status?: string;
}
