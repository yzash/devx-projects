import { useState } from 'react';
import {
  Search, SlidersHorizontal, X, Star, Check, ChevronRight, ShoppingCart,
  Minus, Plus, Watch, Camera, Headphones, Zap, Image, Grid3X3,
  ArrowLeft, Shield, Sparkles, Gift, CreditCard, Truck, Crown, Package
} from 'lucide-react';
import { products, categories, bundles, freeSim } from '../data/products';
import { family } from '../data/family';

const iconMap = { watch: Watch, camera: Camera, headphones: Headphones, 'pen-tool': Zap, image: Image, grid: Grid3X3 };

function ProductIcon({ icon, size = 32, className = '' }) {
  const Icon = iconMap[icon] || Watch;
  return <Icon size={size} className={className} strokeWidth={1.5} />;
}

function ProductImage({ product, className = '', size = 'md' }) {
  const sizeClasses = { sm: 'w-16 h-16', md: 'w-full aspect-square', lg: 'w-full aspect-[4/3]' };
  if (product.image) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl bg-white flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={size === 'lg' ? (product.imageFull || product.image) : product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center ${className}`}>
      <ProductIcon icon={product.icon} size={size === 'lg' ? 80 : size === 'sm' ? 24 : 36} className="text-white/90" />
    </div>
  );
}

export default function ShopScreen({ cart, addToCart, removeFromCart, updateCartQuantity, setScreen }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubscription, setIsSubscription] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [showBundle, setShowBundle] = useState(false);

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.isSubscription ? item.subscriptionPrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  if (checkoutDone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center animate-bounce-in max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-mf-dark mb-2">Order Confirmed! 🎉</h2>
          <p className="text-mf-gray text-sm mb-6">Your myFirst devices are on the way to the Tan family.</p>
          <div className="mf-card p-4 mb-6 text-left">
            <p className="text-xs text-mf-gray mb-2">Estimated delivery</p>
            <p className="text-sm font-bold text-mf-dark">Apr 18-20, 2026</p>
            <p className="text-xs text-mf-gray mt-2">Order #MF-2026-04158</p>
          </div>
          <button onClick={() => setScreen('membership')} className="mf-btn-primary w-full mb-3">
            <Crown size={16} className="inline mr-2" /> Upgrade to Family Gold — Save 20%
          </button>
          <button onClick={() => setScreen('community')} className="text-mf-blue text-sm font-semibold">
            Share your purchase with the community →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-50 px-4 pt-4 pb-3 lg:pt-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-mf-dark">Shop</h1>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
              <Search size={18} className="text-mf-gray" />
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative w-9 h-9 rounded-full bg-mf-blue-light flex items-center justify-center"
            >
              <ShoppingCart size={18} className="text-mf-blue" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-mf-coral text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-mf-blue text-white'
                  : 'bg-gray-50 text-mf-gray hover:bg-gray-100'}`}
            >
              <ProductIcon icon={cat.icon} size={14} className={activeCategory === cat.id ? 'text-white' : 'text-mf-gray'} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bundle Banner */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowBundle(true)}
          className="w-full rounded-2xl p-4 text-left active:scale-[0.99] transition-transform bg-gradient-to-r from-mf-blue to-blue-400"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Package size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-bold">The Complete KidsTech Bundle</p>
              <p className="text-white/70 text-xs">Fone + CareBuds + Camera · Save 28%</p>
              <p className="text-white font-bold text-sm mt-1">S$29.90<span className="font-normal text-white/70">/month</span></p>
            </div>
            <ChevronRight size={18} className="text-white/60" />
          </div>
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 px-4 mt-4">
        {filtered.map(product => (
          <button
            key={product.id}
            onClick={() => { setSelectedProduct(product); setIsSubscription(false); }}
            className="mf-card p-3 text-left active:scale-[0.98] transition-all duration-200"
          >
            <div className="relative mb-3">
              <ProductImage product={product} size="md" />
              {product.badge && (
                <span className={`absolute top-2 left-2 mf-badge text-[10px] ${
                  product.badge === 'New' ? 'bg-green-500 text-white' :
                  product.badge === 'Best Seller' ? 'bg-mf-coral text-white' :
                  'bg-amber-500 text-white'
                }`}>
                  {product.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-mf-gray font-medium">{product.ageRange} years</p>
            <h3 className="text-sm font-bold text-mf-dark leading-tight mt-0.5">{product.name}</h3>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-base font-bold text-mf-dark">S${product.price.toFixed(2)}</span>
            </div>
            {product.subscriptionPrice && (
              <p className="text-[11px] text-mf-blue font-semibold mt-0.5">
                or S${product.subscriptionPrice}/mo subscription
              </p>
            )}
            <div className="flex items-center gap-1 mt-1.5">
              <Star size={12} className="text-amber-400" fill="currentColor" />
              <span className="text-xs text-mf-gray">{product.rating} ({product.reviews})</span>
            </div>
            <p className="text-[10px] text-mf-blue font-medium mt-1">
              Member: S${product.memberPrice.toFixed(2)}
            </p>
          </button>
        ))}
      </div>

      {/* FreeSIM Banner */}
      <div className="px-4 mt-4">
        <div className="mf-card p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-mf-dark">{freeSim.name}</p>
              <p className="text-xs text-mf-gray">{freeSim.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedProduct(null)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl animate-slide-up">
            <div className="sticky top-0 bg-white z-10 px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-50">
              <button onClick={() => setSelectedProduct(null)} className="p-1">
                <X size={22} className="text-mf-gray" />
              </button>
              <span className="text-xs text-mf-gray font-medium">{selectedProduct.category.toUpperCase()}</span>
              <div className="w-6" />
            </div>

            <div className="p-5 space-y-5">
              {/* Product Image */}
              <ProductImage product={selectedProduct} size="lg" />

              {/* Info */}
              <div>
                {selectedProduct.badge && (
                  <span className={`mf-badge text-xs mb-2 ${
                    selectedProduct.badge === 'New' ? 'bg-green-100 text-green-700' :
                    selectedProduct.badge === 'Best Seller' ? 'bg-mf-coral-light text-mf-coral' :
                    'bg-mf-gold-light text-amber-700'
                  }`}>{selectedProduct.badge}</span>
                )}
                <h2 className="text-xl font-bold text-mf-dark">{selectedProduct.name}</h2>
                <p className="text-sm text-mf-gray mt-1">{selectedProduct.tagline}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                  <span className="text-sm font-medium">{selectedProduct.rating}</span>
                  <span className="text-sm text-mf-gray">({selectedProduct.reviews} reviews)</span>
                  <span className="text-sm text-mf-gray">· Ages {selectedProduct.ageRange}</span>
                </div>
              </div>

              {/* Buy Once / Subscribe Toggle */}
              {selectedProduct.subscriptionPrice && (
                <div className="space-y-3">
                  <div className="flex rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => setIsSubscription(false)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        !isSubscription ? 'bg-white text-mf-dark shadow-sm' : 'text-mf-gray'
                      }`}
                    >
                      Buy Once
                    </button>
                    <button
                      onClick={() => setIsSubscription(true)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        isSubscription ? 'bg-mf-blue text-white shadow-sm' : 'text-mf-gray'
                      }`}
                    >
                      Subscribe & Save
                    </button>
                  </div>

                  {isSubscription ? (
                    <div className="bg-mf-blue-50 rounded-2xl p-4 space-y-3 border border-mf-blue/10">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-bold text-mf-blue">S${selectedProduct.subscriptionPrice}</span>
                          <span className="text-sm text-mf-gray">/month</span>
                        </div>
                        <span className="mf-badge bg-mf-blue text-white">Save {selectedProduct.subscriptionSave}</span>
                      </div>
                      <div className="space-y-2">
                        {selectedProduct.subscriptionIncludes.map(benefit => (
                          <div key={benefit} className="flex items-center gap-2">
                            <Check size={14} className="text-mf-blue flex-shrink-0" />
                            <span className="text-sm text-mf-dark">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <span className="mf-badge bg-white text-mf-blue border border-mf-blue/20">Monthly</span>
                        <span className="mf-badge bg-mf-blue text-white">Annual — Best Value</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-mf-dark">S${selectedProduct.price.toFixed(2)}</span>
                      <span className="text-sm text-mf-blue font-medium">Member: S${selectedProduct.memberPrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {!selectedProduct.subscriptionPrice && (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-mf-dark">S${selectedProduct.price.toFixed(2)}</span>
                  <span className="text-sm text-mf-blue font-medium">Member: S${selectedProduct.memberPrice.toFixed(2)}</span>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.features.map(f => (
                    <span key={f} className="mf-badge bg-gray-50 text-mf-dark text-xs">{f}</span>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-2">Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(selectedProduct.specs).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                      <span className="text-sm text-mf-gray capitalize">{key}</span>
                      <span className="text-sm font-medium text-mf-dark">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-2">Colors</h3>
                <div className="flex gap-2">
                  {selectedProduct.colors.map((c, i) => (
                    <span key={c} className={`mf-badge text-xs ${i === 0 ? 'bg-mf-blue text-white' : 'bg-gray-50 text-mf-dark'}`}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  addToCart(selectedProduct, { isSubscription });
                  setSelectedProduct(null);
                }}
                className="mf-btn-primary w-full text-center"
              >
                <ShoppingCart size={16} className="inline mr-2" />
                Add to Cart — S${isSubscription && selectedProduct.subscriptionPrice
                  ? `${selectedProduct.subscriptionPrice}/mo`
                  : selectedProduct.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bundle Modal */}
      {showBundle && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBundle(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl animate-slide-up p-5">
            <button onClick={() => setShowBundle(false)} className="absolute top-4 right-4"><X size={22} className="text-mf-gray" /></button>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl mf-gradient-hero flex items-center justify-center mx-auto mb-3">
                <Package size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-mf-dark">{bundles[0].name}</h2>
              <p className="text-sm text-mf-gray mt-1">{bundles[0].tagline}</p>
            </div>
            <div className="flex items-center justify-center gap-3 mb-5">
              {['watch', 'headphones', 'camera'].map((icon, i) => (
                <div key={icon} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-mf-blue-light flex items-center justify-center">
                    <ProductIcon icon={icon} size={24} className="text-mf-blue" />
                  </div>
                  {i < 2 && <Plus size={14} className="text-mf-gray" />}
                </div>
              ))}
            </div>
            <div className="bg-mf-blue-50 rounded-2xl p-4 mb-5 text-center">
              <p className="text-sm text-mf-gray line-through">S${bundles[0].originalPrice.toFixed(2)} one-time</p>
              <p className="text-3xl font-bold text-mf-blue">S${bundles[0].subscriptionPrice}<span className="text-sm font-normal text-mf-gray">/month</span></p>
              <span className="mf-badge bg-mf-blue text-white mt-2">Save {bundles[0].savings}</span>
            </div>
            <div className="space-y-2 mb-5">
              {bundles[0].features.map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={14} className="text-mf-blue flex-shrink-0" />
                  <span className="text-sm text-mf-dark">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                bundles[0].products.forEach(pid => {
                  const p = products.find(pr => pr.id === pid);
                  if (p) addToCart(p, { isSubscription: true });
                });
                setShowBundle(false);
              }}
              className="mf-btn-primary w-full text-center"
            >
              Subscribe to Bundle — S${bundles[0].subscriptionPrice}/mo
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="relative bg-white w-full max-w-md h-full animate-slide-in-right overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-mf-dark">Cart ({cart.length})</h2>
              <button onClick={() => setShowCart(false)}><X size={22} className="text-mf-gray" /></button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <ShoppingCart size={40} className="text-gray-200 mb-3" />
                <p className="text-mf-gray text-sm">Your cart is empty</p>
                <button onClick={() => setShowCart(false)} className="text-mf-blue text-sm font-semibold mt-3">
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-gray-50">
                    <ProductImage product={item} size="sm" className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-mf-dark truncate">{item.name}</h3>
                      <p className="text-sm font-semibold text-mf-blue">
                        S${item.isSubscription && item.subscriptionPrice ? `${item.subscriptionPrice}/mo` : item.price.toFixed(2)}
                      </p>
                      {item.isSubscription && <span className="mf-badge bg-mf-blue-light text-mf-blue text-[10px]">Subscription</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Membership Upsell */}
                {family.membership.tier === 'silver' && (
                  <div className="bg-mf-gold-light rounded-2xl p-4 border border-mf-gold/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown size={16} className="text-mf-gold" />
                      <span className="text-sm font-bold text-mf-dark">Save more with Family Gold</span>
                    </div>
                    <p className="text-xs text-mf-gray mb-2">Join Family Club Gold to save an extra 10% on this order</p>
                    <button onClick={() => { setShowCart(false); setScreen('membership'); }} className="text-mf-blue text-xs font-semibold">
                      Upgrade now →
                    </button>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mf-gray">Subtotal</span>
                    <span className="font-semibold">S${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mf-gray">Silver member discount (10%)</span>
                    <span className="font-semibold text-green-600">-S${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mf-gray">Delivery</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>S${(cartTotal * 0.9).toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => { setShowCart(false); setShowCheckout(true); }}
                  className="mf-btn-primary w-full text-center"
                >
                  Checkout — S${(cartTotal * 0.9).toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCheckout(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl animate-slide-up">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-50">
              <button onClick={() => setShowCheckout(false)}><ArrowLeft size={22} className="text-mf-gray" /></button>
              <h2 className="text-lg font-bold">Checkout</h2>
              <div className="w-6" />
            </div>
            <div className="p-5 space-y-5">
              {/* Delivery */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-3 flex items-center gap-2">
                  <Truck size={16} className="text-mf-blue" /> Delivery Address
                </h3>
                <div className="mf-card p-3 bg-gray-50">
                  <p className="text-sm font-medium text-mf-dark">Sarah Tan</p>
                  <p className="text-xs text-mf-gray">123 Orchard Road, #08-42, Singapore 238858</p>
                  <p className="text-xs text-mf-blue font-medium mt-1">Estimated: Apr 18-20</p>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-3 flex items-center gap-2">
                  <CreditCard size={16} className="text-mf-blue" /> Payment Method
                </h3>
                <div className="space-y-2">
                  {['•••• 4242 (Visa)', 'PayNow', '3 × monthly instalments'].map((method, i) => (
                    <label key={method} className={`mf-card p-3 flex items-center gap-3 cursor-pointer ${i === 0 ? 'border-2 border-mf-blue' : 'border border-gray-100'}`}>
                      <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-mf-blue' : 'border-gray-300'} flex items-center justify-center`}>
                        {i === 0 && <div className="w-2 h-2 rounded-full bg-mf-blue" />}
                      </div>
                      <span className="text-sm font-medium text-mf-dark">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-mf-gray">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
                    <span className="font-semibold">S${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mf-gray">Silver discount</span>
                    <span className="text-green-600 font-semibold">-S${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>S${(cartTotal * 0.9).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setShowCheckout(false); setCheckoutDone(true); }}
                className="mf-btn-primary w-full text-center"
              >
                <Shield size={16} className="inline mr-2" /> Place Order — S${(cartTotal * 0.9).toFixed(2)}
              </button>
              <p className="text-[10px] text-center text-mf-gray">
                Secured by 256-bit SSL encryption. Cancel subscriptions anytime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
