import { useState, useEffect } from 'react';
import AdminContainer from './components/admin/AdminContainer';
import NotificationContainer from './components/ui/Notification';
import Header from './components/Header';
import CartContainer from './components/cart/CartContainer';
import { useCart } from './hooks/useCart';
import { formatPrice as formatCurrency } from './utils/formatters';
import { useAtomValue, useSetAtom } from 'jotai';
import { isAdminAtom } from './store/uiAtoms';
import { addNotificationAtom } from './store/notificationAtoms';
import { productsAtom } from './store/productAtoms';

const App = () => {
  const isAdmin = useAtomValue(isAdminAtom);
  const products = useAtomValue(productsAtom);

  const addNotification = useSetAtom(addNotificationAtom);
  const {
    cart,
    selectedCoupon,
    totals,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    setSelectedCoupon,
    completeOrder,
    getRemainingStock,
    calculateItemTotal
  } = useCart(products, addNotification);

  const [totalItemCount, setTotalItemCount] = useState(0);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  const formatPrice = (price: number, productId?: string): string => {
    const product = products.find(p => p.id === productId);
    if (product && getRemainingStock(product) <= 0) {
      return 'SOLD OUT';
    }
    return formatCurrency(price, { currency: isAdmin ? 'WON' : 'KRW' });
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <NotificationContainer />
        <Header
            cartItemCount={totalItemCount}
        />

        <main className="max-w-7xl mx-auto px-4 py-8">
          {isAdmin ? (
              <AdminContainer
                  formatPrice={formatPrice}
              />
          ) : (
              <CartContainer
                  cart={cart}
                  selectedCoupon={selectedCoupon}
                  totals={totals}
                  getRemainingStock={getRemainingStock}
                  formatPrice={formatPrice}
                  addToCart={addToCart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  applyCoupon={applyCoupon}
                  setSelectedCoupon={setSelectedCoupon}
                  completeOrder={completeOrder}
                  calculateItemTotal={calculateItemTotal}
              />
          )}
        </main>
      </div>
  );
};

export default App;