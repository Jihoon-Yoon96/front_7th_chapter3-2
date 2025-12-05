import React from 'react';
import Products from './Products';
import Cart from './Cart';

const CartContainer: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Products />
      <Cart />
    </div>
  );
};

export default CartContainer;