import React, { useState } from 'react';
import { Coupon } from '../../../../types';
import AdminCouponList from './AdminCouponList';
import AdminCouponForm from './AdminCouponForm';

interface AdminCouponProps {
  coupons: Coupon[];
  addCoupon: (newCoupon: Coupon) => void;
  deleteCoupon: (couponCode: string) => void;
  addNotification: (message: string, type?: 'error' | 'success' | 'warning') => void;
}

const AdminCoupon: React.FC<AdminCouponProps> = ({
  coupons,
  addCoupon,
  deleteCoupon,
  addNotification
}) => {
  const [showCouponForm, setShowCouponForm] = useState(false);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <AdminCouponList 
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          setShowCouponForm={setShowCouponForm}
        />
        {showCouponForm && (
          <AdminCouponForm
            addCoupon={addCoupon}
            setShowCouponForm={setShowCouponForm}
            addNotification={addNotification}
          />
        )}
      </div>
    </section>
  );
};

export default AdminCoupon;