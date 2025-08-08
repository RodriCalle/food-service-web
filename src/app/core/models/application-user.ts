export interface ApplicationUser {
  id: string;
  userName: string;
  name: string;
  lastName: string;
  documentNumber: string;
  restaurant?: any;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  status?: boolean;
  roles: string[];
}
