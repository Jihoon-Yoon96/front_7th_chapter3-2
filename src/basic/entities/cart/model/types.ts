import { Product } from "../../product/model/types";

export interface CartItem {
  product: Product;
  quantity: number;
}