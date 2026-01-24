export interface SubCategory {
  _id: string;
  name: string;
  ar_name?: string;
  slug: string;
  category: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryType {

  _id: string;
  name: string;
  ar_name?: string;
  slug: string;
  parent?: string | any;
  totalStock?: number;
  totalPieceUsed?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {

  _id: string;
  name: string;
  ar_name: string;
  slug: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive';
  isActive: boolean;
}

export interface Product {
  _id: string;
  title: string;
  ar_title: string;
  sku: string;
  price: number;
  discount: number;
  stockStatus: string;
  featuredImage: string;
  isActive: boolean;
}

export interface Order {
  _id: string;
  code: string;
  user: User | string;
  status: string;
  amount: number;
  payment: string;
  placedAt: string;
}
