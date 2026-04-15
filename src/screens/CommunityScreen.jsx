import { useState } from 'react';
import {
  Heart, MessageCircle, Bookmark, Share2, Award, Camera, Shield,
  Sparkles, Star, Compass, ChevronRight, Calendar, Users, MapPin,
  Trophy, Target, Plus, Check, Filter
} from 'lucide-react';
import { posts, challenges, badges, events, forumCategories } from '../data/community';
import { family } from '../data/family';

const badgeIcons = { star: Star, compass: Compass, camera: Camera, shield: Shield, sparkles: Sparkles, footprints: Target };

function PostCard({ post, onLike }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const creationGradients = {
    'sunset-photo': 'from-orange-300 via-pink-300 to-purple-400',
    '3d-creation': 'from-cyan-300 via-blue-300 to-indigo-400',
    'art-creation': 'from-pink-300 via-rose-300 to-red-300',
  };

  return (
    <div className="mf-card p-4">
      {/* Author */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-mf-blue-light flex items-center justify-center text-mf-blue text-xs font-bold">
          {post.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-mf-dark">{post.author}</span>
            {post.authorAge && <span className="text-xs text-mf-gray">age {post.authorAge}</span>}
            {post.authorRole && (
              <span className="mf-badge bg-mf-coral-light text-mf-coral text-[10px]">{post.authorRole}</span>
            )}
          </div>
          <p className="text-[11px] text-mf-gray">{post.timeAgo}</p>
        </div>
        {post.badge && (
          <span className="mf-badge bg-mf-blue-light text-mf-blue text-[10px]">
            <Award size={10} className="mr-0.5" /> {post.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-mf-dark leading-relaxed">{post.content}</p>

      {/* Image */}
      {post.imageType && (
        <div className={`w-full h-44 rounded-xl mt-3 bg-gradient-to-br ${creationGradients[post.imageType] || 'from-gray-200 to-gray-300'} flex items-center justify-center`}>
          <div className="text-center text-white/80">
            <Camera size={28} className="mx-auto mb-1" />
            <p className="text-xs font-medium">
              {post.imageType === 'sunset-photo' && 'Sunset at East Coast Park'}
              {post.imageType === '3d-creation' && '3D Printed Dinosaur'}
              {post.imageType === 'art-creation' && 'Rainbow Flower Drawing'}
            </p>
          </div>
        </div>
      )}

      {/* Official Reply */}
      {post.officialReply && (
        <div className="mt-3 bg-mf-blue-50 rounded-xl p-3 border border-mf-blue/10">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-full mf-gradient-hero flex items-center justify-center">
              <Check size={8} className="text-white" />
            </div>
            <span className="text-xs font-bold text-mf-blue">{post.officialReply.author}</span>
          </div>
          <p className="text-xs text-mf-dark">{post.officialReply.content}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-gray-50">
        <button onClick={toggleLike} className="flex items-center gap-1.5 text-sm">
          <Heart size={16} className={liked ? 'text-red-500 fill-red-500' : 'text-mf-gray'} />
          <span className={`font-medium ${liked ? 'text-red-500' : 'text-mf-gray'}`}>{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-mf-gray">
          <MessageCircle size={16} />
          <span className="font-medium">{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm text-mf-gray ml-auto">
          <Bookmark size={16} />
        </button>
        <button className="flex items-center gap-1.5 text-sm text-mf-gray">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [showBadges, setShowBadges] = useState(false);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'tip', label: 'Tips' },
    { id: 'creation', label: 'Creations' },
    { id: 'question', label: 'Questions' },
    { id: 'events', label: 'Events' },
  ];

  const filteredPosts = activeTab === 'all' ? posts :
    activeTab === 'events' ? [] :
    posts.filter(p => p.type === activeTab);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 pt-4 pb-3 border-b border-gray-50 lg:pt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-mf-dark">Community</h1>
            <p className="text-xs text-mf-gray mt-0.5">myFirst Circle Hub · 2.4K families</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBadges(!showBadges)}
              className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center"
            >
              <Award size={18} className="text-amber-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-mf-blue text-white' : 'bg-gray-50 text-mf-gray hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Points & Badges Summary */}
      <div className="px-4 mt-4">
        <div className="mf-card p-4 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Trophy size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-mf-dark">{family.stats.communityPoints} Community Points</p>
            <p className="text-xs text-mf-gray">The Tan Family · 3 badges earned</p>
          </div>
          <button onClick={() => setShowBadges(true)} className="text-xs text-mf-blue font-semibold">View</button>
        </div>
      </div>

      {/* Weekly Challenge */}
      {activeTab !== 'events' && (
        <div className="px-4 mt-4">
          {challenges.map(challenge => (
            <div key={challenge.id} className="mf-card p-4 mb-3 border-2 border-mf-coral/10 bg-gradient-to-r from-mf-coral-light/50 to-white">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-mf-coral" />
                <span className="mf-badge bg-mf-coral text-white text-[10px]">Weekly Challenge</span>
                <span className="text-[10px] text-mf-gray ml-auto">Ends {challenge.endDate}</span>
              </div>
              <h3 className="text-sm font-bold text-mf-dark">{challenge.title}</h3>
              <p className="text-xs text-mf-gray mt-1">{challenge.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-mf-gray">{challenge.submissions} submissions</span>
                  <span className="text-xs text-mf-gray">🎁 {challenge.prize}</span>
                </div>
                <button className="mf-badge bg-mf-coral text-white text-xs font-semibold px-3 py-1">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts Feed */}
      {activeTab !== 'events' && (
        <div className="px-4 mt-2 space-y-3">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="px-4 mt-4 space-y-3">
          {events.map(event => (
            <div key={event.id} className="mf-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`mf-badge text-[10px] ${
                  event.type === 'in-person' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {event.type === 'in-person' ? '📍 In-Person' : '💻 Virtual'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-mf-dark">{event.title}</h3>
              <p className="text-xs text-mf-gray mt-1">{event.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Calendar size={12} className="text-mf-gray" />
                  <span className="text-xs text-mf-gray">{event.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={12} className="text-mf-gray" />
                  <span className="text-xs text-mf-gray truncate">{event.location}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-24">
                    <div
                      className="h-full bg-mf-blue rounded-full"
                      style={{ width: `${((event.totalSpots - event.spotsLeft) / event.totalSpots) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-mf-gray mt-0.5">{event.spotsLeft} spots left</p>
                </div>
                <button className="mf-badge bg-mf-blue text-white text-xs font-semibold px-3 py-1.5">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forum Categories */}
      {activeTab === 'all' && (
        <div className="px-4 mt-5">
          <h2 className="text-lg font-bold text-mf-dark mb-3">Parent Forum</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {forumCategories.map(cat => {
              const CatIcon = { smartphone: Camera, 'book-open': Star, shield: Shield, palette: Sparkles, 'message-square': MessageCircle }[cat.icon] || Star;
              return (
                <button key={cat.id} className="mf-card p-3 text-left active:scale-[0.98] transition-transform">
                  <CatIcon size={18} className="text-mf-blue mb-2" />
                  <p className="text-sm font-semibold text-mf-dark">{cat.name}</p>
                  <p className="text-xs text-mf-gray">{cat.count} posts</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges Modal */}
      {showBadges && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBadges(false)} />
          <div className="relative bg-white w-full max-w-md max-h-[80vh] overflow-y-auto rounded-t-3xl lg:rounded-3xl animate-slide-up p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-mf-dark">Community Badges</h2>
              <button onClick={() => setShowBadges(false)}>
                <span className="text-mf-gray text-2xl leading-none">&times;</span>
              </button>
            </div>
            <div className="space-y-3">
              {badges.map(badge => {
                const BadgeIcon = badgeIcons[badge.icon] || Star;
                const isEarned = family.children.some(c => c.badges.includes(badge.name));
                return (
                  <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl ${isEarned ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 opacity-60'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEarned ? 'bg-amber-100' : 'bg-gray-200'}`}>
                      <BadgeIcon size={18} className={isEarned ? 'text-amber-600' : 'text-gray-400'} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isEarned ? 'text-mf-dark' : 'text-gray-400'}`}>{badge.name}</p>
                      <p className="text-xs text-mf-gray">{badge.description}</p>
                    </div>
                    {isEarned && <Check size={16} className="text-amber-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Ask the Community FAB */}
      <button className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 w-14 h-14 rounded-full bg-mf-blue text-white shadow-mf-lg flex items-center justify-center active:scale-95 transition-transform z-40 hover:shadow-xl">
        <Plus size={24} />
      </button>
    </div>
  );
}
