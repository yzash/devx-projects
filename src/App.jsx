import { useState, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import MembershipScreen from './screens/MembershipScreen';
import StoreScreen from './screens/StoreScreen';
import AISupportScreen from './screens/AISupportScreen';
import CommunityScreen from './screens/CommunityScreen';

const screens = {
  home: HomeScreen,
  shop: ShopScreen,
  membership: MembershipScreen,
  store: StoreScreen,
  support: AISupportScreen,
  community: CommunityScreen,
};

export default function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);

  const addToCart = useCallback((product, options = {}) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, ...options }];
    });
    setNotification('Added to cart!');
    setTimeout(() => setNotification(null), 2000);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const ActiveScreenComponent = screens[activeScreen];

  return (
    <div className="min-h-screen bg-mf-gray-light pb-20 lg:pb-0">
      {/* Desktop Top Nav */}
      <nav className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg mf-gradient-hero flex items-center justify-center">
            <span className="text-white text-sm font-bold">m</span>
          </div>
          <span className="text-xl font-bold text-mf-dark">my<span className="text-mf-blue">First</span></span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { id: 'home', label: 'Home' },
            { id: 'shop', label: 'Shop' },
            { id: 'membership', label: 'Membership' },
            { id: 'store', label: 'Find a Store' },
            { id: 'support', label: 'AI Support' },
            { id: 'community', label: 'Community' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeScreen === item.id
                  ? 'bg-mf-blue text-white'
                  : 'text-mf-gray hover:text-mf-dark hover:bg-gray-50'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveScreen('shop')}
            className="relative text-mf-gray hover:text-mf-dark transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-mf-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-mf-blue-light flex items-center justify-center text-mf-blue text-sm font-semibold">
            ST
          </div>
        </div>
      </nav>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
          <div className="bg-mf-dark text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-xl">
            {notification}
          </div>
        </div>
      )}

      {/* Active Screen */}
      <main className="max-w-7xl mx-auto">
        <div key={activeScreen} className="screen-enter">
          <ActiveScreenComponent
            setScreen={setActiveScreen}
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
          />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        cartCount={cart.length}
      />
    </div>
  );
}
