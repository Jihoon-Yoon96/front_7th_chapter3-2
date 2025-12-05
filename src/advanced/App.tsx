import AdminContainer from './components/admin/AdminContainer';
import NotificationContainer from './components/ui/Notification';
import Header from './components/Header';
import CartContainer from './components/cart/CartContainer';
import { useAtomValue } from 'jotai';
import { isAdminAtom } from './store/uiAtoms';

const App = () => {
  const isAdmin = useAtomValue(isAdminAtom);

  return (
      <div className="min-h-screen bg-gray-50">
        <NotificationContainer />
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {isAdmin ? <AdminContainer /> : <CartContainer />}
        </main>
      </div>
  );
};

export default App;