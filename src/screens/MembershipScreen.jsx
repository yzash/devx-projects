import { useState } from 'react';
import {
  Crown, Check, X, ChevronRight, Watch, Camera, Headphones, Shield,
  Battery, Wifi, Clock, Award, Star, ArrowRight, Users, Sparkles,
  Heart, MapPin, Zap, TrendingUp
} from 'lucide-react';
import { family, parentalControls } from '../data/family';
import { tiers, upgradeComparison } from '../data/membership';

const deviceIcons = { watch: Watch, camera: Camera, headphones: Headphones };

function ProgressBar({ value, max, color = 'bg-mf-blue' }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function MembershipScreen({ setScreen }) {
  const [view, setView] = useState('dashboard'); // dashboard | tiers | upgrade
  const [showMoments, setShowMoments] = useState(false);

  const currentTier = tiers.find(t => t.id === family.membership.tier);
  const nextTier = tiers.find(t => t.id === 'gold');

  if (view === 'tiers') {
    return (
      <div className="pb-4">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 pt-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('dashboard')} className="p-1"><X size={22} className="text-mf-gray" /></button>
            <h1 className="text-lg font-bold text-mf-dark">Family Club Tiers</h1>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {tiers.map(tier => (
            <div key={tier.id} className={`mf-card p-5 relative overflow-hidden ${tier.id === family.membership.tier ? 'border-2 border-mf-blue' : 'border border-gray-100'}`}>
              {tier.recommended && (
                <div className="absolute top-0 right-0 mf-gradient-gold text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  RECOMMENDED
                </div>
              )}
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-mf-blue text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                  CURRENT PLAN
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${tier.colorClass} flex items-center justify-center`}>
                  <Crown size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-mf-dark">{tier.name}</h3>
                  <p className="text-sm font-semibold text-mf-blue">{tier.priceLabel}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {tier.features.map(f => (
                  <div key={f.text} className="flex items-center gap-2.5">
                    {f.included ? (
                      <Check size={14} className="text-mf-blue flex-shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${f.included ? 'text-mf-dark' : 'text-gray-300'}`}>{f.text}</span>
                  </div>
                ))}
              </div>
              {tier.id !== family.membership.tier && tier.price > 0 && (
                <button
                  onClick={() => setView('upgrade')}
                  className={`mt-4 w-full py-2.5 rounded-full text-sm font-semibold transition-all ${
                    tier.recommended ? 'mf-btn-primary' : 'mf-btn-outline'
                  }`}
                >
                  {tier.price > (currentTier?.price || 0) ? 'Upgrade' : 'Select'} — {tier.priceLabel}
                </button>
              )}
              {tier.id === family.membership.tier && (
                <div className="mt-4 w-full py-2.5 rounded-full text-sm font-semibold text-center bg-mf-blue-light text-mf-blue">
                  Your Current Plan
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'upgrade') {
    return (
      <div className="pb-4">
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 pt-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('dashboard')} className="p-1"><X size={22} className="text-mf-gray" /></button>
            <h1 className="text-lg font-bold text-mf-dark">Upgrade to Gold</h1>
          </div>
        </div>
        <div className="p-4 space-y-5">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl mf-gradient-gold flex items-center justify-center mx-auto mb-4 relative">
              <Crown size={36} className="text-white" />
              <div className="absolute inset-0 rounded-2xl mf-shimmer" />
            </div>
            <h2 className="text-2xl font-bold text-mf-dark">Family Gold</h2>
            <p className="text-mf-gray text-sm mt-1">The perfect plan for growing families</p>
            <p className="text-3xl font-bold text-mf-dark mt-3">S$19.90<span className="text-sm font-normal text-mf-gray">/month</span></p>
            <p className="text-sm text-mf-coral font-semibold">{upgradeComparison.priceDelta} vs your current plan</p>
          </div>

          {/* Comparison */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-mf-dark">What you get with Gold</h3>
            {upgradeComparison.benefits.map(b => (
              <div key={b.label} className="mf-card p-3 flex items-center justify-between">
                <span className="text-sm text-mf-gray">{b.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 line-through">{b.current}</span>
                  <ArrowRight size={12} className="text-mf-gray" />
                  <span className="text-sm font-bold text-mf-blue">{b.upgrade}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Gold Benefits */}
          <div className="mf-card p-4 border border-mf-gold/20 bg-mf-gold-light/50">
            <h3 className="text-sm font-bold text-mf-dark mb-3">Gold-exclusive perks</h3>
            <div className="space-y-2.5">
              {[
                { icon: Gift, text: 'Free accessory every quarter (S$40 value)' },
                { icon: Sparkles, text: 'Dedicated AI coach for your family' },
                { icon: MapPin, text: 'VIP in-store experience access' },
                { icon: TrendingUp, text: 'Advanced usage insights & reports' },
              ].map(p => (
                <div key={p.text} className="flex items-center gap-2.5">
                  <p.icon size={16} className="text-mf-gold flex-shrink-0" />
                  <span className="text-sm text-mf-dark">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="mf-btn-primary w-full text-center">
            Upgrade to Gold — S$19.90/month
          </button>
          <p className="text-xs text-center text-mf-gray">Cancel or downgrade anytime. No lock-in contract.</p>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="pb-4 space-y-5">
      {/* Header */}
      <div className="px-4 pt-4 lg:pt-6">
        <h1 className="text-2xl font-bold text-mf-dark">Family Club</h1>
        <p className="text-sm text-mf-gray mt-0.5">Manage your membership & devices</p>
      </div>

      {/* Tier Hero Card */}
      <div className="px-4">
        <div className="mf-gradient-silver rounded-2xl p-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 mf-shimmer opacity-30" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown size={20} />
                <span className="text-sm font-semibold opacity-90">Family Silver</span>
              </div>
              <button onClick={() => setView('tiers')} className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                View Tiers
              </button>
            </div>
            <h2 className="text-2xl font-bold">{family.name}</h2>
            <p className="text-white/80 text-sm mt-1">Member since {family.membership.joinedDate}</p>
            <div className="flex items-center gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold">{family.devices.length}<span className="text-sm font-normal opacity-80">/{currentTier?.devices}</span></p>
                <p className="text-xs opacity-80">Devices</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div>
                <p className="text-2xl font-bold">{currentTier?.discount}</p>
                <p className="text-xs opacity-80">Discount</p>
              </div>
              <div className="w-px h-8 bg-white/30" />
              <div>
                <p className="text-2xl font-bold">{family.membership.renewalDays}</p>
                <p className="text-xs opacity-80">Days to renewal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="px-4">
        <button
          onClick={() => setView('upgrade')}
          className="w-full mf-card p-4 flex items-center gap-3 border border-mf-gold/20 bg-mf-gold-light/30 text-left active:scale-[0.99] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl mf-gradient-gold flex items-center justify-center flex-shrink-0 relative">
            <Crown size={20} className="text-white" />
            <div className="absolute inset-0 rounded-xl mf-shimmer" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-mf-dark">Upgrade to Family Gold</h3>
            <p className="text-xs text-mf-gray">+S$10/mo — 20% off everything + quarterly gifts</p>
          </div>
          <ChevronRight size={18} className="text-mf-gold flex-shrink-0" />
        </button>
      </div>

      {/* Benefits Tracker */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-mf-dark mb-3">Benefits Usage</h2>
        <div className="space-y-3">
          <div className="mf-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-mf-dark">Device Slots</span>
              <span className="text-sm font-bold text-mf-blue">{family.devices.length} of {currentTier?.devices}</span>
            </div>
            <ProgressBar value={family.devices.length} max={currentTier?.devices || 3} />
          </div>
          <div className="mf-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-mf-dark">Member Discount Savings</span>
              <span className="text-sm font-bold text-green-600">S$42.50 saved</span>
            </div>
            <ProgressBar value={42.5} max={100} color="bg-green-500" />
            <p className="text-xs text-mf-gray mt-1">This quarter · 10% on all purchases</p>
          </div>
        </div>
      </div>

      {/* Device Registry */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-mf-dark mb-3">Registered Devices</h2>
        <div className="space-y-3">
          {family.devices.map(device => {
            const DeviceIcon = deviceIcons[device.image] || Watch;
            return (
              <div key={device.id} className="mf-card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {device.productImage ? (
                      <img src={device.productImage} alt={device.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <DeviceIcon size={22} className="text-mf-blue" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-mf-dark">{device.name}</h3>
                      <span className="mf-badge bg-green-100 text-green-700 text-[10px]">Active</span>
                    </div>
                    <p className="text-xs text-mf-gray mt-0.5">Assigned to {device.assignedTo} · {device.color}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1">
                        <Battery size={12} className="text-mf-gray" />
                        <span className="text-xs text-mf-gray">{device.batteryHealth}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield size={12} className="text-mf-gray" />
                        <span className="text-xs text-mf-gray">{device.warranty}</span>
                      </div>
                      {device.simStatus && (
                        <div className="flex items-center gap-1">
                          <Wifi size={12} className="text-green-500" />
                          <span className="text-xs text-green-600">{device.simStatus}</span>
                        </div>
                      )}
                    </div>
                    {device.subscription && (
                      <div className="mt-2 bg-mf-blue-50 rounded-lg px-3 py-1.5">
                        <p className="text-xs text-mf-blue font-medium">{device.subscription}</p>
                        <p className="text-[10px] text-mf-gray">Next billing: {device.nextBilling}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Child Profiles */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-mf-dark mb-3">Family Members</h2>
        <div className="space-y-3">
          {family.children.map(child => (
            <div key={child.id} className="mf-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-mf-blue-light flex items-center justify-center text-mf-blue font-bold text-sm">
                  {child.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-mf-dark">{child.name}, {child.age}</h3>
                  <p className="text-xs text-mf-gray">{child.devices.length} device{child.devices.length !== 1 ? 's' : ''} · {child.communityPoints} points</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {child.badges.map(badge => (
                  <span key={badge} className="mf-badge bg-mf-blue-light text-mf-blue text-[10px]">
                    <Award size={10} className="mr-0.5" /> {badge}
                  </span>
                ))}
              </div>
              {/* Parental Controls Summary */}
              {parentalControls[child.name.toLowerCase()] && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <p className="text-xs font-semibold text-mf-dark">Parental Controls</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-mf-blue" />
                      <span className="text-xs text-mf-gray">Screen: {parentalControls[child.name.toLowerCase()].screenTime.used}/{parentalControls[child.name.toLowerCase()].screenTime.daily}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-green-500" />
                      <span className="text-xs text-mf-gray">Geo-fence: {parentalControls[child.name.toLowerCase()].geoFence.status}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <button className="w-full mf-card p-3 text-center border-2 border-dashed border-gray-200 text-mf-gray text-sm font-medium">
            <Users size={16} className="inline mr-1.5" /> Add Family Member
          </button>
        </div>
      </div>

      {/* myFirst Moments Timeline */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-mf-dark">myFirst Moments</h2>
          <button onClick={() => setShowMoments(!showMoments)} className="text-mf-blue text-sm font-semibold">
            {showMoments ? 'Show less' : 'View all'}
          </button>
        </div>
        <div className="space-y-0">
          {(showMoments ? family.moments : family.moments.slice(0, 3)).map((moment, i) => (
            <div key={moment.id} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  moment.type === 'milestone' ? 'bg-mf-blue-light' :
                  moment.type === 'badge' ? 'bg-amber-50' :
                  'bg-mf-coral-light'
                }`}>
                  {moment.type === 'milestone' && <Heart size={14} className="text-mf-blue" />}
                  {moment.type === 'badge' && <Award size={14} className="text-amber-500" />}
                  {moment.type === 'membership' && <Crown size={14} className="text-mf-coral" />}
                </div>
                {i < (showMoments ? family.moments.length - 1 : 2) && (
                  <div className="w-0.5 h-full bg-gray-100 min-h-[20px]" />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium text-mf-dark">{moment.text}</p>
                <p className="text-xs text-mf-gray mt-0.5">{moment.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing Info */}
      <div className="px-4 pb-2">
        <div className="mf-card p-4 bg-gray-50">
          <h3 className="text-sm font-bold text-mf-dark mb-2">Billing & Subscription</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Current plan</span>
              <span className="font-medium">{family.membership.tierName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Next billing</span>
              <span className="font-medium">{family.membership.nextBilling}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-mf-gray">Payment method</span>
              <span className="font-medium">Visa •••• 4242</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="text-xs text-mf-blue font-semibold">Manage billing</button>
            <span className="text-gray-300">·</span>
            <button className="text-xs text-mf-gray font-semibold">Pause membership</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Gift icon for export use
function Gift({ size, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}
