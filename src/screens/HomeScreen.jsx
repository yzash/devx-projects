import { useState, useEffect } from 'react';
import {
  Watch, Camera, Headphones, Footprints, Phone, Award, ChevronRight,
  Star, Wifi, Calendar, ArrowRight, Zap, Crown, Gift, Shield
} from 'lucide-react';
import { family } from '../data/family';
import { products } from '../data/products';
import { challenges } from '../data/community';

const productIcons = {
  watch: Watch,
  camera: Camera,
  headphones: Headphones,
  'pen-tool': Zap,
  image: Award,
};

function AnimatedNumber({ value, duration = 1500 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function ProductCarouselCard({ product, onClick }) {
  const IconComponent = productIcons[product.icon] || Watch;
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-44 mf-card p-4 text-left hover:shadow-mf-card-hover transition-all duration-300 active:scale-[0.98]"
    >
      {product.image ? (
        <div className="w-full h-28 rounded-xl bg-white flex items-center justify-center mb-3 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" loading="lazy" />
        </div>
      ) : (
        <div className={`w-full h-28 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center mb-3`}>
          <IconComponent className="text-white/90" size={40} strokeWidth={1.5} />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-mf-blue">{product.category.toUpperCase()}</p>
        <h3 className="text-sm font-bold text-mf-dark leading-tight">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-mf-dark">S${product.price.toFixed(2)}</span>
          {product.subscriptionPrice && (
            <span className="mf-badge bg-mf-blue-light text-mf-blue text-[10px]">
              S${product.subscriptionPrice}/mo
            </span>
          )}
        </div>
        {product.badge && (
          <span className={`mf-badge text-[10px] ${
            product.badge === 'New' ? 'bg-green-100 text-green-700' :
            product.badge === 'Best Seller' ? 'bg-mf-coral-light text-mf-coral' :
            'bg-mf-gold-light text-amber-700'
          }`}>
            {product.badge}
          </span>
        )}
      </div>
    </button>
  );
}

export default function HomeScreen({ setScreen }) {
  return (
    <div className="space-y-5 pb-4">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-b-3xl lg:rounded-3xl lg:mx-4 lg:mt-4">
        {/* Banner background image */}
        <div className="absolute inset-0">
          <img
            src="https://sg.myfirst.tech/cdn/shop/files/FoneS4_Sharing_Img.png?v=1736212644&width=3840"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-mf-dark/80 via-mf-dark/50 to-transparent" />
        </div>
        <div className="relative px-5 pt-12 pb-8 lg:px-12 lg:py-16">
          <div className="lg:max-w-xl">
            <img
              src="https://sg.myfirst.tech/cdn/shop/files/myFirst_Logo.png?v=1613768838&width=600"
              alt="myFirst"
              className="h-8 w-auto mb-4 lg:hidden"
            />
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
              <Star size={12} className="text-yellow-300" fill="currentColor" />
              <span className="text-white/90 text-xs font-medium">World&apos;s First KidsTech Ecosystem</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              Your child&apos;s first tech adventure starts here.
            </h1>
            <p className="text-white/80 text-sm lg:text-base mb-6 leading-relaxed">
              Smart devices designed for kids, loved by parents. Safe, fun, and educational technology for ages 3-16.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setScreen('shop')}
                className="mf-btn-primary bg-white text-mf-blue hover:bg-gray-50 font-bold"
              >
                Explore Products
              </button>
              <button
                onClick={() => setScreen('membership')}
                className="px-6 py-3 rounded-full border-2 border-white/40 text-white font-semibold
                  hover:bg-white/10 transition-all duration-200 active:scale-95"
              >
                Join Family Club
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personalised Greeting */}
      <div className="px-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-mf-dark">
              Welcome back, {family.name} 👋
            </h2>
            <p className="text-sm text-mf-gray mt-0.5">
              {family.children.map(c => c.name).join(' & ')}&apos;s devices are all connected
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-mf-blue-light flex items-center justify-center text-mf-blue font-bold text-sm">
            {family.parent.avatar}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar — WHOOP-inspired */}
      <div className="px-4 animate-slide-up-delay-1">
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { icon: Footprints, value: family.stats.stepsTracked, label: 'Steps', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Camera, value: family.stats.photosTaken, label: 'Photos', color: 'text-pink-500', bg: 'bg-pink-50' },
            { icon: Phone, value: family.stats.callsMade, label: 'Calls', color: 'text-green-500', bg: 'bg-green-50' },
            { icon: Award, value: family.stats.communityPoints, label: 'Points', color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map(stat => (
            <div key={stat.label} className="mf-card p-3 text-center">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                <stat.icon size={16} className={stat.color} />
              </div>
              <p className="text-lg font-bold text-mf-dark leading-none">
                <AnimatedNumber value={stat.value} />
              </p>
              <p className="text-[10px] text-mf-gray font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Carousel */}
      <div className="animate-slide-up-delay-2">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-mf-dark">Featured Products</h2>
          <button
            onClick={() => setScreen('shop')}
            className="text-mf-blue text-sm font-semibold flex items-center gap-1 hover:underline"
          >
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
          {products.slice(0, 4).map(product => (
            <ProductCarouselCard
              key={product.id}
              product={product}
              onClick={() => setScreen('shop')}
            />
          ))}
        </div>
      </div>

      {/* Membership Banner */}
      <div className="px-4 animate-slide-up-delay-3">
        <button
          onClick={() => setScreen('membership')}
          className="w-full relative overflow-hidden rounded-2xl p-5 text-left active:scale-[0.99] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #D4A853 0%, #F0D78C 40%, #D4A853 100%)',
          }}
        >
          <div className="absolute inset-0 mf-shimmer" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={18} className="text-white" />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wide">Family Club</span>
            </div>
            <h3 className="text-white text-lg font-bold mb-1">
              Upgrade to Family Gold
            </h3>
            <p className="text-white/80 text-sm mb-3">
              Free accessory every quarter + 20% member pricing on everything
            </p>
            <div className="flex flex-wrap gap-2">
              {['20% Off', '6 Devices', 'VIP Access', 'AI Coach'].map(chip => (
                <span key={chip} className="bg-white/25 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  {chip}
                </span>
              ))}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <ArrowRight size={20} className="text-white/60" />
            </div>
          </div>
        </button>
      </div>

      {/* Upcoming Community Event */}
      <div className="px-4 animate-slide-up-delay-4">
        <button
          onClick={() => setScreen('community')}
          className="w-full mf-card p-4 text-left active:scale-[0.99] transition-transform"
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-mf-coral-light flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-mf-coral" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="mf-badge bg-mf-coral-light text-mf-coral text-[10px]">This Week</span>
              </div>
              <h3 className="text-sm font-bold text-mf-dark">{challenges[0].title}</h3>
              <p className="text-xs text-mf-gray mt-0.5">{challenges[0].submissions} submissions · Ends {challenges[0].endDate}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-2" />
          </div>
        </button>
      </div>

      {/* FreeSIM Upsell */}
      <div className="px-4 animate-slide-up-delay-4">
        <div className="mf-card p-4 border border-green-100 bg-green-50/50">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Wifi size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-mf-dark">Stay Connected with FreeSIM</h3>
              <p className="text-xs text-mf-gray mt-0.5">
                Add mobile data to Liam&apos;s Fone R2 — free with subscription
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="mf-badge bg-green-100 text-green-700 text-[10px]">500MB/month</span>
                <span className="mf-badge bg-green-100 text-green-700 text-[10px]">20+ countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending AI Chat */}
      {family.recentChat.pending && (
        <div className="px-4">
          <button
            onClick={() => setScreen('support')}
            className="w-full mf-card p-4 border border-mf-blue-light text-left active:scale-[0.99] transition-transform"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-full bg-mf-blue-light flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🤖</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-mf-blue font-semibold mb-0.5">Mochi AI · Pending question</p>
                <p className="text-sm text-mf-dark truncate">&quot;{family.recentChat.question}&quot;</p>
              </div>
              <ChevronRight size={18} className="text-mf-blue flex-shrink-0 mt-2" />
            </div>
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 pb-2">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: Gift, label: 'Gift a Device', color: 'text-pink-500', bg: 'bg-pink-50', screen: 'shop' },
            { icon: Shield, label: 'Safety Check', color: 'text-green-500', bg: 'bg-green-50', screen: 'membership' },
            { icon: Crown, label: 'My Benefits', color: 'text-amber-500', bg: 'bg-amber-50', screen: 'membership' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => setScreen(action.screen)}
              className="mf-card p-3 text-center active:scale-95 transition-transform"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center mx-auto mb-1.5`}>
                <action.icon size={18} className={action.color} />
              </div>
              <p className="text-xs font-medium text-mf-dark">{action.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
