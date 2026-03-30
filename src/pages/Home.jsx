import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import KPICard from '../components/KPICard';
import { useConversations } from '../contexts/ConversationContext';
import { useAuth } from '../contexts/AuthContext';
import { getGreeting, formatRelativeTime } from '../utils/formatters';
import api from '../utils/api';

const DEFAULT_METRICS = [
  { id: 'default-1', metric_key: 'monthly_revenue', value: '£892K', change: '+8.4%', trend: 'up', label: 'Revenue This Month' },
  { id: 'default-2', metric_key: 'pipeline_value', value: '£3.98M', change: '+12.1%', trend: 'up', label: 'Pipeline Value' },
  { id: 'default-3', metric_key: 'open_tickets', value: '43', change: '-5', trend: 'down', label: 'Open Support Tickets' },
  { id: 'default-4', metric_key: 'overdue_receivables', value: '£162K', change: '+£12K', trend: 'up', label: 'Overdue Receivables' },
];

const QUICK_QUESTIONS = [
  "What's our revenue this month?",
  "Show me deals closing this quarter",
  "Are there any overdue invoices?",
  "How is our support team doing?",
  "Which inventory items need reordering?",
  "What's our lead conversion rate?",
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations } = useConversations();
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await api.get('/api/pinned-metrics');
        if (res.data.pinnedMetrics && res.data.pinnedMetrics.length > 0) {
          setMetrics(res.data.pinnedMetrics);
        }
      } catch (_) {
        // Use defaults
      } finally {
        setLoadingMetrics(false);
      }
    }
    loadMetrics();
  }, []);

  const handleQuestion = (question) => {
    navigate('/chat', { state: { initialMessage: question } });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}{user?.isDemo ? '' : ', CEO'}
          </h1>
          <p className="text-gray-500 mt-1">Here's your business overview for today, 30 March 2026</p>
        </div>

        {/* KPI Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Key Metrics</h2>
            {loadingMetrics && <Loader2 size={14} className="text-gray-400 animate-spin" />}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <KPICard key={metric.id || metric.metric_key} metric={metric} />
            ))}
          </div>
        </div>

        {/* Start asking */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Ask a Question</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuestion(q)}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-left transition-all shadow-sm group"
              >
                <MessageSquare size={16} className="text-gray-400 group-hover:text-indigo-500 flex-shrink-0" />
                <span className="text-sm text-gray-700 group-hover:text-indigo-700">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent conversations */}
        {conversations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Recent Conversations</h2>
              <button
                onClick={() => navigate('/chat')}
                className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all <ArrowRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {conversations.slice(0, 5).map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => navigate(`/chat/${conv.id}`)}
                  className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 text-left transition-all"
                >
                  <MessageSquare size={15} className="text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-gray-700 truncate">{conv.title || 'Untitled conversation'}</span>
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatRelativeTime(conv.updated_at)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
