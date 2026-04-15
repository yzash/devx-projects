import { useState } from 'react';
import {
  MapPin, Navigation, Clock, Phone, ChevronRight, X, Star,
  Sparkles, Settings, Shield, Users, Package, Calendar, Check,
  QrCode, ArrowLeft
} from 'lucide-react';
import { stores, bookingSlots } from '../data/stores';

const serviceIcons = {
  sparkles: Sparkles, settings: Settings, shield: Shield, users: Users, package: Package,
};

export default function StoreScreen() {
  const [selectedStore, setSelectedStore] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showCollect, setShowCollect] = useState(false);

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center animate-bounce-in max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-mf-dark mb-2">Session Booked!</h2>
          <p className="text-mf-gray text-sm mb-6">Your myFirst Discovery Session is confirmed.</p>
          <div className="mf-card p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Store</span>
              <span className="font-medium text-mf-dark">Suntec City</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Date</span>
              <span className="font-medium text-mf-dark">Tomorrow, Apr 16</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Time</span>
              <span className="font-medium text-mf-dark">{selectedSlot || '2:00 PM'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Duration</span>
              <span className="font-medium text-mf-dark">30 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Confirmation</span>
              <span className="font-medium text-mf-blue">#MF-BK-2026-0419</span>
            </div>
          </div>
          <button onClick={() => { setBookingConfirmed(false); setSelectedStore(null); setShowBooking(false); }} className="mf-btn-secondary w-full text-center">
            Done
          </button>
          <button className="text-mf-blue text-sm font-semibold mt-3 block mx-auto">
            <Calendar size={14} className="inline mr-1" /> Add to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 lg:pt-6">
        <h1 className="text-2xl font-bold text-mf-dark">Find a Store</h1>
        <p className="text-sm text-mf-gray mt-0.5">Visit us for hands-on experiences</p>
      </div>

      {/* Map Area */}
      <div className="px-4 mb-4">
        <div className="w-full h-48 lg:h-72 rounded-2xl overflow-hidden relative bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
          {/* Styled SVG Map */}
          <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Water areas */}
            <rect x="0" y="0" width="400" height="200" fill="#EFF6FF" />
            <ellipse cx="350" cy="100" rx="80" ry="100" fill="#DBEAFE" />
            <ellipse cx="50" cy="160" rx="60" ry="50" fill="#DBEAFE" />

            {/* Land masses (stylized Singapore) */}
            <path d="M80,60 Q120,40 200,50 Q280,55 340,70 Q360,90 340,120 Q300,150 200,145 Q120,140 80,120 Q60,100 80,60Z"
                  fill="#E0F2FE" stroke="#93C5FD" strokeWidth="1.5" />

            {/* Roads */}
            <line x1="100" y1="80" x2="320" y2="90" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4,2" />
            <line x1="200" y1="50" x2="200" y2="140" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4,2" />

            {/* Store Pins */}
            <g className="cursor-pointer" onClick={() => setSelectedStore(stores[0])}>
              <circle cx="220" cy="85" r="12" fill="#0057FF" opacity="0.2">
                <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="220" cy="85" r="8" fill="#0057FF" stroke="white" strokeWidth="2" />
              <text x="220" y="89" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>
              <text x="220" y="72" textAnchor="middle" fill="#0057FF" fontSize="7" fontWeight="600">Suntec City</text>
            </g>
            <g className="cursor-pointer" onClick={() => setSelectedStore(stores[2])}>
              <circle cx="160" cy="90" r="6" fill="#6B7280" stroke="white" strokeWidth="2" />
              <text x="160" y="93" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">3</text>
              <text x="160" y="82" textAnchor="middle" fill="#6B7280" fontSize="6" fontWeight="600">ION Orchard</text>
            </g>

            {/* User location */}
            <circle cx="190" cy="100" r="5" fill="#10B981" stroke="white" strokeWidth="2">
              <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="190" y="113" textAnchor="middle" fill="#10B981" fontSize="6" fontWeight="600">You</text>
          </svg>

          {/* Location indicator */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
            <Navigation size={12} className="text-mf-blue" />
            <span className="text-xs font-medium text-mf-dark">Near Suntec City</span>
          </div>
        </div>
      </div>

      {/* Stores Near You */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-mf-dark mb-3">Stores Near You</h2>
        <div className="space-y-3">
          {stores.map(store => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className="w-full mf-card p-4 text-left active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  store.featured ? 'mf-gradient-hero' : 'bg-gray-100'
                }`}>
                  <MapPin size={20} className={store.featured ? 'text-white' : 'text-mf-gray'} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-mf-dark truncate">{store.name}</h3>
                    {store.featured && (
                      <span className="mf-badge bg-mf-blue-light text-mf-blue text-[10px] flex-shrink-0">Featured</span>
                    )}
                  </div>
                  <p className="text-xs text-mf-gray mt-0.5 truncate">{store.address}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-mf-gray">
                      <Clock size={11} /> {store.hours.split(': ')[1]}
                    </span>
                    {store.distance && (
                      <span className="flex items-center gap-1 text-xs text-mf-blue font-medium">
                        <Navigation size={11} /> {store.distance}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {store.services.slice(0, 3).map(s => (
                      <span key={s.name} className="mf-badge bg-gray-50 text-mf-gray text-[10px]">{s.name}</span>
                    ))}
                    {store.services.length > 3 && (
                      <span className="mf-badge bg-gray-50 text-mf-gray text-[10px]">+{store.services.length - 3}</span>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Click & Collect Banner */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowCollect(true)}
          className="w-full mf-card p-4 bg-gradient-to-r from-mf-blue-50 to-blue-50 border border-mf-blue/10 text-left active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-mf-blue-light flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-mf-blue" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-mf-dark">Click & Collect</h3>
              <p className="text-xs text-mf-gray">Order online, collect in-store today</p>
            </div>
            <ChevronRight size={18} className="text-mf-blue flex-shrink-0" />
          </div>
        </button>
      </div>

      {/* Store Detail Modal */}
      {selectedStore && !showBooking && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedStore(null)} />
          <div className="relative bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl animate-slide-up">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white z-10 rounded-t-3xl">
              <button onClick={() => setSelectedStore(null)}><X size={22} className="text-mf-gray" /></button>
              <h2 className="text-sm font-bold text-mf-dark">Store Details</h2>
              <div className="w-6" />
            </div>

            <div className="p-5 space-y-5">
              {/* Store Hero */}
              <div className={`w-full h-40 rounded-2xl flex items-center justify-center ${
                selectedStore.featured ? 'mf-gradient-hero' : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }`}>
                <div className="text-center text-white">
                  <MapPin size={36} className="mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-bold">{selectedStore.name.split('—')[0].trim()}</p>
                  <p className="text-xs opacity-70">{selectedStore.city}, {selectedStore.country}</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-mf-gray flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-mf-dark">{selectedStore.address}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-mf-gray flex-shrink-0" />
                  <p className="text-sm text-mf-dark">{selectedStore.hours}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={16} className="text-mf-gray flex-shrink-0" />
                  <p className="text-sm text-mf-blue font-medium">{selectedStore.phone}</p>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-3">Services</h3>
                <div className="space-y-2.5">
                  {selectedStore.services.map(service => {
                    const ServiceIcon = serviceIcons[service.icon] || Sparkles;
                    return (
                      <div key={service.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                          <ServiceIcon size={16} className="text-mf-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-mf-dark">{service.name}</p>
                          <p className="text-xs text-mf-gray">{service.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Events */}
              {selectedStore.upcomingEvents.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-mf-dark mb-3">Upcoming Events</h3>
                  <div className="space-y-2">
                    {selectedStore.upcomingEvents.map(event => (
                      <div key={event.name} className="mf-card p-3 border border-mf-coral-light">
                        <p className="text-sm font-semibold text-mf-dark">{event.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-mf-gray">{event.date}</p>
                          <span className="mf-badge bg-mf-coral-light text-mf-coral text-[10px]">{event.spots} spots left</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowBooking(true)}
                  className="mf-btn-primary w-full text-center"
                >
                  <Sparkles size={16} className="inline mr-2" /> Book a Discovery Session
                </button>
                <button className="mf-btn-outline w-full text-center">
                  <Navigation size={16} className="inline mr-2" /> Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative bg-white w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl animate-slide-up p-5">
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => setShowBooking(false)}><ArrowLeft size={22} className="text-mf-gray" /></button>
              <h2 className="text-lg font-bold text-mf-dark">Book Discovery Session</h2>
              <div className="w-6" />
            </div>

            <div className="space-y-5">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-mf-blue-light flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={24} className="text-mf-blue" />
                </div>
                <p className="text-sm text-mf-gray">30-min hands-on demo with a myFirst advisor</p>
              </div>

              {/* Date */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-2">Select Date</h3>
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                    <button
                      key={day}
                      className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        i === 1 ? 'bg-mf-blue text-white' : 'bg-gray-50 text-mf-dark hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-xs font-medium">{day}</p>
                      <p className="text-lg font-bold">{15 + i}</p>
                      <p className="text-[10px] opacity-70">Apr</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="text-sm font-bold text-mf-dark mb-2">Select Time</h3>
                <div className="grid grid-cols-4 gap-2">
                  {bookingSlots.map(slot => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
                        selectedSlot === slot.time ? 'bg-mf-blue text-white' :
                        slot.available ? 'bg-gray-50 text-mf-dark hover:bg-gray-100' :
                        'bg-gray-50 text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setBookingConfirmed(true)}
                disabled={!selectedSlot}
                className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${
                  selectedSlot
                    ? 'mf-btn-primary'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Confirm Booking {selectedSlot ? `— ${selectedSlot}` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click & Collect Modal */}
      {showCollect && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCollect(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl lg:rounded-3xl animate-slide-up p-5">
            <button onClick={() => setShowCollect(false)} className="absolute top-4 right-4"><X size={22} className="text-mf-gray" /></button>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-mf-blue-light flex items-center justify-center mx-auto mb-3">
                <Package size={28} className="text-mf-blue" />
              </div>
              <h2 className="text-xl font-bold text-mf-dark">Click & Collect</h2>
              <p className="text-sm text-mf-gray mt-1">Order online, pick up in-store today</p>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { step: '1', text: 'Shop online and select "Collect in Store" at checkout' },
                { step: '2', text: 'Receive a QR code confirmation on your phone' },
                { step: '3', text: 'Visit your chosen store and scan to collect' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-mf-blue text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.step}
                  </div>
                  <p className="text-sm text-mf-dark pt-0.5">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-mf-gold-light rounded-xl p-3 mb-5">
              <p className="text-xs font-semibold text-mf-dark">🎁 In-store exclusive</p>
              <p className="text-xs text-mf-gray mt-0.5">Member-only bundles available when collecting in person</p>
            </div>
            <button className="mf-btn-secondary w-full text-center">
              Start Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
