import { useState, useCallback, useEffect } from 'react';
import { CartItem } from '../entities/cart/model/types';
import { Coupon } from '../entities/coupon/model/types';
import { Product } from '../entities/product/model/types';
import { ProductWithUI } from '../model/productModels';
import { getRemainingStock } from '../entities/product/lib/stock';
import { calculateCartTotal } from '../entities/cart/lib/calc';

export const useCart = (products: ProductWithUI[]) => {
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

  const addNotification = (message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    // 이 함수는 App.tsx에서 props로 받아야 하지만, 일단 임시로 구현합니다.
    // 실제 구현에서는 의존성 주입 등의 방법을 사용해야 합니다.
    console.log(`${type}: ${message}`);
  };

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  const addToCart = useCallback((product: ProductWithUI) => {
    const remainingStock = memoizedGetRemainingStock(product);
    if (remainingStock <= 0) {
      addNotification('재고가 부족합니다!', 'error');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        if (newQuantity > product.stock) {
          addNotification(`재고는 ${product.stock}개까지만 있습니다.`, 'error');
          return prevCart;
        }

        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      return [...prevCart, { product, quantity: 1 }];
    });
    
    addNotification('장바구니에 담았습니다', 'success');
  }, [cart, addNotification, memoizedGetRemainingStock]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock;
    if (newQuantity > maxStock) {
      addNotification(`재고는 ${maxStock}개까지만 있습니다.`, 'error');
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, [products, removeFromCart, addNotification]);

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
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
    getRemainingStock: memoizedGetRemainingStock
  };
};