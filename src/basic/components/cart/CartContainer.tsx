import React from 'react';
import { Product } from '../../entities/product/model/types';
import { CartItem } from '../../entities/cart/model/types';
import { Coupon } from '../../entities/coupon/model/types';
import Products from './Products';
import Cart from './Cart';

interface CartContainerProps {
  products: Product[];
  cart: CartItem[];
  coupons: Coupon[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  };
  getRemainingStock: (product: Product) => number;
  formatPrice: (price: number, productId?: string) => string;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  setSelectedCoupon: (coupon: Coupon | null) => void;
  completeOrder: () => void;
  calculateItemTotal: (item: CartItem) => number;
  debouncedSearchTerm: string;
}

const CartContainer: React.FC<CartContainerProps> = (props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Products 
        products={props.products}
        getRemainingStock={props.getRemainingStock}
        formatPrice={props.formatPrice}
        addToCart={props.addToCart}
        debouncedSearchTerm={props.debouncedSearchTerm}
      />
      <Cart 
        cart={props.cart}
        coupons={props.coupons}
        selectedCoupon={props.selectedCoupon}
        totals={props.totals}
        removeFromCart={props.removeFromCart}
        updateQuantity={props.updateQuantity}
        applyCoupon={props.applyCoupon}
        setSelectedCoupon={props.setSelectedCoupon}
        completeOrder={props.completeOrder}
        calculateItemTotal={props.calculateItemTotal}
      />
    </div>
  );
};

export default CartContainer;