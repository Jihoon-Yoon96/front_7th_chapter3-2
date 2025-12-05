import { Coupon } from "../model/types";

export function addCoupon(
  coupons: Coupon[],
  newCoupon: Coupon
): { newCoupons: Coupon[]; success: boolean; message: string } {
  const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
  if (existingCoupon) {
    return {
      newCoupons: coupons,
      success: false,
      message: "이미 존재하는 쿠폰 코드입니다.",
    };
  }
  const newCoupons = [...coupons, newCoupon];
  return {
    newCoupons,
    success: true,
    message: "쿠폰이 추가되었습니다.",
  };
}

export function deleteCoupon(
  coupons: Coupon[],
  couponCode: string
): { newCoupons: Coupon[] } {
  const newCoupons = coupons.filter((c) => c.code !== couponCode);
  return { newCoupons };
}
