import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { CartItem, Coupon, Product } from '../../types';
import { addNotificationAtom } from './notificationAtoms';
import { calculateCartTotal, calculateItemTotal } from '../entities/cart/lib/calc';
import { getRemainingStock } from '../entities/product/lib/stock';

// 기본 아톰: 장바구니 목록을 localStorage와 동기화
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

// 기본 아톰: 선택된 쿠폰
export const selectedCouponAtom = atom<Coupon | null>(null);

// 읽기 전용 아톰: 장바구니 아이템 개수
export const cartItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});

// 읽기 전용 아톰: 총액 계산
export const totalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const selectedCoupon = get(selectedCouponAtom);
  return calculateCartTotal(cart, selectedCoupon);
});

// 읽기 전용 아톰: 상품 재고 계산 (외부에서 상품 객체를 받아 처리)
export const remainingStockSelector = atom((get) => (product: Product) => {
  const cart = get(cartAtom);
  return getRemainingStock(product, cart);
});

// 읽기 전용 아톰: 장바구니 아이템 총액 계산 (외부에서 아이템 객체를 받아 처리)
export const itemTotalSelector = atom((get) => (item: CartItem) => {
  const cart = get(cartAtom);
  return calculateItemTotal(item, cart);
});

// 쓰기 전용 아톰: 장바구니에 상품 추가 (함수형 업데이트 사용)
export const addToCartAtom = atom(null, (get, set, product: Product) => {
  set(cartAtom, (prevCart) => {
    const remainingStock = getRemainingStock(product, prevCart);
    if (remainingStock <= 0) {
      set(addNotificationAtom, '재고가 없습니다.');
      return prevCart;
    }

    const existingItem = prevCart.find((item) => item.product.id === product.id);
    let newCart: CartItem[];

    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (newQuantity > product.stock) {
        set(addNotificationAtom, `재고는 ${product.stock}개까지만 있습니다.`);
        return prevCart;
      }
      newCart = prevCart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: newQuantity } : item
      );
    } else {
      newCart = [...prevCart, { product, quantity: 1 }];
    }
    
    set(addNotificationAtom, '장바구니에 담았습니다.');
    return newCart;
  });
});

// 쓰기 전용 아톰: 장바구니에서 상품 제거
export const removeFromCartAtom = atom(null, (get, set, productId: string) => {
  set(cartAtom, (prevCart) => prevCart.filter((item) => item.product.id !== productId));
});

// 쓰기 전용 아톰: 장바구니 상품 수량 변경 (product 객체를 직접 받도록 수정)
export const updateQuantityAtom = atom(null, (get, set, { product, newQuantity }: { product: Product; newQuantity: number }) => {
  set(cartAtom, (prevCart) => {
    if (newQuantity <= 0) {
      return prevCart.filter((item) => item.product.id !== product.id);
    }

    if (newQuantity > product.stock) {
      set(addNotificationAtom, `재고는 ${product.stock}개까지만 있습니다.`);
      return prevCart.map((item) =>
        item.product.id === product.id ? { ...item, quantity: product.stock } : item
      );
    }

    return prevCart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
  });
});

// 쓰기 전용 아톰: 쿠폰 적용
export const applyCouponAtom = atom(null, (get, set, coupon: Coupon) => {
  set(selectedCouponAtom, coupon);
  set(addNotificationAtom, `${coupon.name} 쿠폰이 적용되었습니다.`);
});

// 쓰기 전용 아톰: 주문 완료
export const completeOrderAtom = atom(null, (get, set) => {
  const cart = get(cartAtom);
  if (cart.length === 0) {
    set(addNotificationAtom, '장바구니가 비어있습니다.');
    return;
  }
  set(cartAtom, []);
  set(selectedCouponAtom, null);
  set(addNotificationAtom, '주문이 완료되었습니다.');
});
