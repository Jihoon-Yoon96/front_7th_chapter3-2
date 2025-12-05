import { atom } from 'jotai';
import { productsAtom } from './productAtoms';
import { remainingStockSelector } from './cartAtoms';
import { formatPrice as formatCurrency } from '../utils/formatters';

export const isAdminAtom = atom(false);

export const priceFormatterAtom = atom((get) => {
  const products = get(productsAtom);
  const getRemainingStock = get(remainingStockSelector);
  const isAdmin = get(isAdminAtom);

  return (price: number, productId?: string): string => {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product) <= 0) {
      return 'SOLD OUT';
    }
    return formatCurrency(price, { currency: isAdmin ? 'WON' : 'KRW' });
  };
});
