import { atom } from 'jotai';
import { Coupon } from '../../types';
import { atomWithStorage } from 'jotai/utils';
import { addNotificationAtom } from './notificationAtoms';
import { initialCoupons } from '../constant/coupons';

// 기본 아톰: 쿠폰 목록을 localStorage와 동기화하여 저장
export const couponsAtom = atomWithStorage<Coupon[]>('coupons', initialCoupons);

// 읽기/쓰기 아톰: 쿠폰 추가 로직
export const addCouponAtom = atom(
  null,
  (get, set, newCoupon: Coupon) => {
    set(couponsAtom, (prev) => [...prev, newCoupon]);
    set(addNotificationAtom, '쿠폰이 추가되었습니다.');
  }
);

// 읽기/쓰기 아톰: 쿠폰 삭제 로직
export const deleteCouponAtom = atom(
  null,
  (get, set, couponCode: string) => {
    set(couponsAtom, (prev) => prev.filter((c) => c.code !== couponCode));
    set(addNotificationAtom, '쿠폰이 삭제되었습니다.');
  }
);
