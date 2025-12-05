import { useState, useCallback, useEffect } from 'react';
import { Coupon } from '../entities/coupon/model/types';
import { initialCoupons } from '../constant/coupons';
import { addCoupon as addCouponManager, deleteCoupon as deleteCouponManager } from '../entities/coupon/lib/couponManager';

type AddNotification = (message: string, type?: 'error' | 'success' | 'warning') => void;

export const useCoupons = (addNotification: AddNotification) => {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialCoupons;
      }
    }
    return initialCoupons;
  });

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = useCallback((newCoupon: Coupon) => {
    const { newCoupons, success, message } = addCouponManager(coupons, newCoupon);
    setCoupons(newCoupons);
    addNotification(message, success ? 'success' : 'error');
  }, [coupons, addNotification]);

  const deleteCoupon = useCallback((couponCode: string) => {
    const { newCoupons } = deleteCouponManager(coupons, couponCode);
    setCoupons(newCoupons);
    addNotification('쿠폰이 삭제되었습니다.', 'success');
  }, [coupons, addNotification]);

  return {
    coupons,
    addCoupon,
    deleteCoupon
  };
};