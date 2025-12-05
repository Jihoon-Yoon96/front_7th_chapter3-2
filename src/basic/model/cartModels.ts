import { ProductWithUI } from './productModels';

export interface CartItem {
  product: ProductWithUI;
  quantity: number;
}