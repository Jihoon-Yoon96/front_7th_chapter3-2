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
    set(productsAtom, [...get(productsAtom), newProductWithId]);
    set(addNotificationAtom, '상품이 추가되었습니다.');
  }
);

// 읽기/쓰기 아톰: 상품 수정 로직
export const updateProductAtom = atom(
  null,
  (get, set, updatedProduct: Product) => {
    const products = get(productsAtom);
    const newProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    set(productsAtom, newProducts);
    set(addNotificationAtom, '상품이 수정되었습니다.');
  }
);

// 읽기/쓰기 아톰: 상품 삭제 로직
export const deleteProductAtom = atom(
  null,
  (get, set, productId: string) => {
    const products = get(productsAtom);
    const newProducts = products.filter((p) => p.id !== productId);
    set(productsAtom, newProducts);
    set(addNotificationAtom, '상품이 삭제되었습니다.');
  }
);

// 기본 아톰: 검색어 상태
export const searchTermAtom = atom('');

// 읽기 전용 아톰: 디바운스된 검색어 상태
// Jotai 2.0에서는 async-derived atoms를 사용하여 디바운스를 더 쉽게 처리할 수 있습니다.
// 여기서는 간단하게 searchTermAtom을 바로 사용하거나, 필요시 useEffect와 결합하는 방식을 컴포넌트 레벨에서 사용합니다.
// 더 복잡한 비동기 로직이 필요하다면 atomWithObservable 등을 사용할 수 있습니다.

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
