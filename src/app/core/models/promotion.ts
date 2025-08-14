export interface Promotion {
  id: string;
  name: string;
  price: number;

  restaurant?: any;
  promotionItems: any[];

  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  status?: boolean;
}
