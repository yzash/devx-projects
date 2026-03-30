import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, MessageSquare, Bookmark, Settings, LogOut, ChevronDown, Trash2, BarChart3 } from 'lucide-react';
import { useConversations } from '../contexts/ConversationContext';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime } from '../utils/formatters';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const {
    conversations,
    savedQueries,
    createConversation,
    deleteSavedQuery,
    setActiveConversationId
  } = useConversations();

  const [showSaved, setShowSaved] = useState(true);

  const handleNewChat = async () => {
    const conv = await createConversation('New Chat');
    setActiveConversationId(conv.id);
    navigate('/chat');
  };

  const handleConversationClick = (conv) => {
    setActiveConversationId(conv.id);
    navigate(`/chat/${conv.id}`);
  };

  return (
    <div className="w-60 flex-shrink-0 bg-gray-900 flex flex-col h-full border-r border-gray-800">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">CEO Intelligence</p>
            <p className="text-gray-500 text-xs">Business AI Platform</p>
          </div>
        </Link>
      </div>

      {/* New Chat */}
      <div className="px-3 py-3 border-b border-gray-800">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          <PlusCircle size={16} />
          New Chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1.5">Recent</p>

        {conversations.length === 0 ? (
          <p className="text-xs text-gray-600 px-2 py-1">No conversations yet</p>
        ) : (
          conversations.slice(0, 10).map((conv) => {
            const isActive = location.pathname === `/chat/${conv.id}`;
            return (
              <button
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-colors group ${
                  isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <MessageSquare size={14} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{conv.title || 'Untitled'}</p>
                  <p className="text-xs text-gray-600">{formatRelativeTime(conv.updated_at)}</p>
                </div>
              </button>
            );
          })
        )}

        {/* Saved Queries */}
        <div className="mt-4">
          <button
            onClick={() => setShowSaved(!showSaved)}
            className="flex items-center gap-1.5 px-2 py-1.5 w-full text-left"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex-1">Saved Queries</p>
            <ChevronDown size={12} className={`text-gray-600 transition-transform ${showSaved ? '' : '-rotate-90'}`} />
          </button>

          {showSaved && (
            <div className="space-y-0.5 mt-1">
              {savedQueries.length === 0 ? (
                <p className="text-xs text-gray-600 px-2 py-1">No saved queries</p>
              ) : (
                savedQueries.map((sq) => (
                  <div key={sq.id} className="group flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-800">
                    <Bookmark size={13} className="text-gray-600 flex-shrink-0" />
                    <button
                      onClick={() => navigate('/chat', { state: { initialMessage: sq.query_text } })}
                      className="flex-1 min-w-0 text-left"
                    >
                      <p className="text-xs text-gray-400 truncate">{sq.label}</p>
                    </button>
                    <button
                      onClick={() => deleteSavedQuery(sq.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 py-3 border-t border-gray-800 space-y-0.5">
        <Link
          to="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors text-sm"
        >
          <Settings size={15} />
          Settings
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors text-sm"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
}
