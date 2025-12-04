import { Product } from './productModels';

export interface CartItem {
  product: Product;
  quantity: number;
}