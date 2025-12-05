import { useState, useCallback, useEffect } from 'react';
import { Notification } from './model/notificationModels';
import AdminContainer from './components/admin/AdminContainer';
import NotificationContainer from './components/ui/Notification';
import Header from './components/Header';
import CartContainer from './components/cart/CartContainer';
import { useProducts } from './hooks/useProducts';
import { useCoupons } from './hooks/useCoupons';
import { useCart } from './hooks/useCart';
import { formatPrice as formatCurrency } from './utils/formatters';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const addNotification = useCallback((message: string, type: 'error' | 'success' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  }, []);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts(addNotification);
  const { coupons, addCoupon, deleteCoupon } = useCoupons(addNotification);
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

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const [totalItemCount, setTotalItemCount] = useState(0);
  
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const formatPrice = (price: number, productId?: string): string => {
    const product = products.find(p => p.id === productId);
    if (product && getRemainingStock(product) <= 0) {
      return 'SOLD OUT';
    }
    return formatCurrency(price, { currency: isAdmin ? 'WON' : 'KRW' });
  };

  const filteredProducts = debouncedSearchTerm
    ? products.filter(product => 
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      )
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationContainer notifications={notifications} onClose={removeNotification} />
      <Header 
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartItemCount={totalItemCount}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminContainer
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            addCoupon={addCoupon}
            deleteCoupon={deleteCoupon}
            formatPrice={formatPrice}
            addNotification={addNotification}
          />
        ) : (
          <CartContainer
            products={filteredProducts}
            cart={cart}
            coupons={coupons}
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
            debouncedSearchTerm={debouncedSearchTerm}
          />
        )}
      </main>
    </div>
  );
};

export default App;