import { CartItem } from "../model/types";
import { Product } from "../../product/model/types";
import { Coupon } from "../../coupon/model/types";
import { calculateCartTotal } from "./calc";

export function addItem(cart: CartItem[], productToAdd: Product): { newCart: CartItem[], success: boolean, notification: string } {
    const stock = productToAdd.stock;
    const existingItem = cart.find(item => item.product.id === productToAdd.id);
    const currentQuantityInCart = existingItem?.quantity || 0;

    if (currentQuantityInCart >= stock) {
        return { newCart: cart, success: false, notification: '재고가 부족합니다!' };
    }

    if (existingItem) {
        const newCart = cart.map(item =>
            item.product.id === productToAdd.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );
        return { newCart, success: true, notification: '장바구니에 담았습니다' };
    } else {
        const newCart = [...cart, { product: productToAdd, quantity: 1 }];
        return { newCart, success: true, notification: '장바구니에 담았습니다' };
    }
}

export function updateItemQuantity(cart: CartItem[], productId: string, newQuantity: number, productStock: number): { newCart: CartItem[], error?: string } {
    if (newQuantity > productStock) {
        return { newCart: cart, error: `재고는 ${productStock}개까지만 있습니다.` };
    }

    if (newQuantity <= 0) {
        return removeItem(cart, productId);
    }

    const newCart = cart.map(item =>
        item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
    );
    return { newCart };
}

export function removeItem(cart: CartItem[], productId: string): { newCart: CartItem[] } {
    const newCart = cart.filter(item => item.product.id !== productId);
    return { newCart };
}

export function applyCouponToCart(cart: CartItem[], coupon: Coupon): { success: boolean, message: string } {
    const currentTotal = calculateCartTotal(cart, null).totalAfterDiscount;

    if (currentTotal < 10000 && coupon.discountType === 'percentage') {
        return { success: false, message: 'percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.' };
    }
    return { success: true, message: '쿠폰이 적용되었습니다.' };
}

export function completeOrderProcess(cart: CartItem[]): { success: boolean, message: string, newCart: CartItem[] } {
    if (cart.length === 0) {
        return { success: false, message: "장바구니가 비어있습니다.", newCart: cart };
    }
    const orderNumber = `ORD-${Date.now()}`;
    return { success: true, message: `주문이 완료되었습니다. 주문번호: ${orderNumber}`, newCart: [] };
}