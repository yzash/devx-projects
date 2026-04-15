import { Home, ShoppingBag, Crown, MapPin, Bot, Users } from 'lucide-react';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'membership', label: 'Club', icon: Crown },
  { id: 'store', label: 'Stores', icon: MapPin },
  { id: 'support', label: 'AI Help', icon: Bot },
  { id: 'community', label: 'Community', icon: Users },
];

export default function BottomNav({ activeScreen, setActiveScreen, cartCount }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1.5">
        {navItems.map(item => {
          const isActive = activeScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 relative min-w-[52px]
                ${isActive ? 'text-mf-blue' : 'text-gray-400'}`}
            >
              <div className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {item.id === 'shop' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 bg-mf-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-medium transition-colors duration-200
                ${isActive ? 'text-mf-blue' : 'text-gray-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 w-5 h-0.5 bg-mf-blue rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
