import { atom } from 'jotai';
import { Product } from '../../types';
import { atomWithStorage } from 'jotai/utils';
import { addNotificationAtom } from './notificationAtoms';
import { initialProducts } from '../constant/product';

// 기본 아톰: 상품 목록을 localStorage와 동기화하여 저장
export const productsAtom = atomWithStorage<Product[]>('products', initialProducts);

// 읽기/쓰기 아톰: 상품 추가 로직
export const addProductAtom = atom(
  null,
  (get, set, newProduct: Omit<Product, 'id'>) => {
    const newProductWithId = { ...newProduct, id: `p${Date.now()}` };
    set(productsAtom, (prev) => [...prev, newProductWithId]);
    set(addNotificationAtom, '상품이 추가되었습니다.');
  }
);

// 읽기/쓰기 아톰: 상품 수정 로직
export const updateProductAtom = atom(
  null,
  (get, set, updatedProduct: Product) => {
    set(productsAtom, (prev) => 
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    set(addNotificationAtom, '상품이 수정되었습니다.');
  }
);

// 읽기/쓰기 아톰: 상품 삭제 로직
export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    set(productsAtom, (prev) => prev.filter((p) => p.id !== productId));
    set(addNotificationAtom, '상품이 삭제되었습니다.');
  }
);

// 기본 아톰: 검색어 상태
export const searchTermAtom = atom('');

// 읽기 전용 아톰: 필터링된 상품 목록
export const filteredProductsAtom = atom((get) => {
  const products = get(productsAtom);
  const searchTerm = get(searchTermAtom);
  if (!searchTerm) {
    return products;
  }
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
});
