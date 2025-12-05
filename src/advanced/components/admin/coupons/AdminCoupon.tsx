import React, { useState } from 'react';
import AdminCouponList from './AdminCouponList';
import AdminCouponForm from './AdminCouponForm';
import { useSetAtom } from 'jotai';
import { addCouponAtom } from '../../../store/couponAtoms';

const AdminCoupon: React.FC = () => {
  const [showCouponForm, setShowCouponForm] = useState(false);
  const addCoupon = useSetAtom(addCouponAtom);

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>
      <div className="p-6">
        <AdminCouponList 
          setShowCouponForm={setShowCouponForm}
        />
        {showCouponForm && (
          <AdminCouponForm
            addCoupon={addCoupon}
            setShowCouponForm={setShowCouponForm}
          />
        )}
      </div>
    </section>
  );
};

export default AdminCoupon;