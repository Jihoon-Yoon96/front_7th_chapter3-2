import { CartItem } from "../model/types";
import { Product } from "../../product/model/types";

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
        const newCart = cart.filter(item => item.product.id !== productId);
        return { newCart };
    }

    const newCart = cart.map(item =>
        item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
    );
    return { newCart };
}
