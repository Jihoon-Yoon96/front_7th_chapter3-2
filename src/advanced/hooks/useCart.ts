import { useState, useCallback, useEffect } from 'react';
import { CartItem } from '../entities/cart/model/types';
import { Coupon } from '../entities/coupon/model/types';
import { Product } from '../entities/product/model/types';
import { ProductWithUI } from '../model/productModels';
import { getRemainingStock } from '../entities/product/lib/stock';
import { calculateCartTotal, calculateItemTotal } from '../entities/cart/lib/calc';
import { 
  addItem, 
  updateItemQuantity, 
  removeItem, 
  applyCouponToCart, 
  completeOrderProcess 
} from '../entities/cart/lib/cartManager';

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
    const { newCart } = removeItem(cart, productId);
    setCart(newCart);
  }, [cart]);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const { newCart, error } = updateItemQuantity(cart, productId, newQuantity, product.stock);
    setCart(newCart);
    if (error) {
      addNotification(error, 'error');
    }
  }, [cart, products, addNotification]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    const { success, message } = applyCouponToCart(cart, coupon);
    if (success) {
      setSelectedCoupon(coupon);
      addNotification(message, 'success');
    } else {
      addNotification(message, 'error');
    }
  }, [cart, addNotification]);

  const completeOrder = useCallback(() => {
    const { success, message, newCart } = completeOrderProcess(cart);
    if (success) {
      addNotification(message, 'success');
      setCart(newCart);
      setSelectedCoupon(null);
    } else {
      addNotification(message, 'error');
    }
  }, [cart, addNotification]);

  return {
    cart,
    selectedCoupon,
    totals,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
    getRemainingStock: memoizedGetRemainingStock,
    calculateItemTotal: memoizedCalculateItemTotal
  };
};