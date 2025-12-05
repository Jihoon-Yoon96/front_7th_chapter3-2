import { useState, useCallback, useEffect } from 'react';
import { CartItem } from '../entities/cart/model/types';
import { Coupon } from '../entities/coupon/model/types';
import { Product } from '../entities/product/model/types';
import { ProductWithUI } from '../model/productModels';
import { getRemainingStock } from '../entities/product/lib/stock';
import { calculateCartTotal, calculateItemTotal } from '../entities/cart/lib/calc';
import { addItem, updateItemQuantity as updateCartItemQuantityFn } from '../entities/cart/lib/cartManager';

type AddNotification = (message: string, type?: 'error' | 'success' | 'warning') => void;

export const useCart = (products: ProductWithUI[], addNotification: AddNotification) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const memoizedGetRemainingStock = useCallback((product: Product) => getRemainingStock(product, cart), [cart]);
  const totals = calculateCartTotal(cart, selectedCoupon);
  const memoizedCalculateItemTotal = (item: CartItem) => calculateItemTotal(item, cart);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = useCallback((product: ProductWithUI) => {
    const { newCart, success, notification } = addItem(cart, product);
    setCart(newCart);
    addNotification(notification, success ? 'success' : 'error');
  }, [cart, addNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateCartItemQuantity = useCallback((productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const { newCart, error } = updateCartItemQuantityFn(cart, productId, newQuantity, product.stock);
    setCart(newCart);
    if (error) {
      addNotification(error, 'error');
    }
  }, [cart, products, addNotification]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    const currentTotal = calculateCartTotal(cart, selectedCoupon).totalAfterDiscount;
    
    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
      addNotification('percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.', 'error');
      return;
    }

    setSelectedCoupon(coupon);
    addNotification('쿠폰이 적용되었습니다.', 'success');
  }, [cart, selectedCoupon, addNotification]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, 'success');
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return {
    cart,
    selectedCoupon,
    totals,
    addToCart,
    removeFromCart,
    updateQuantity: updateCartItemQuantity,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
    getRemainingStock: memoizedGetRemainingStock,
    calculateItemTotal: memoizedCalculateItemTotal
  };
};