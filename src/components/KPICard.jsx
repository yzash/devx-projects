import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SPARKLINE_DATA = {
  monthly_revenue: [
    { v: 824500 }, { v: 976200 }, { v: 1142800 }, { v: 987300 }, { v: 1053600 }, { v: 892100 }
  ],
  pipeline_value: [
    { v: 3100000 }, { v: 3400000 }, { v: 3200000 }, { v: 3600000 }, { v: 3800000 }, { v: 3980000 }
  ],
  open_tickets: [
    { v: 58 }, { v: 51 }, { v: 63 }, { v: 47 }, { v: 55 }, { v: 43 }
  ],
  overdue_receivables: [
    { v: 95000 }, { v: 120000 }, { v: 108000 }, { v: 142000 }, { v: 138000 }, { v: 162000 }
  ],
};

const METRIC_LABELS = {
  monthly_revenue: 'Revenue This Month',
  pipeline_value: 'Pipeline Value',
  open_tickets: 'Open Tickets',
  overdue_receivables: 'Overdue Receivables',
};

const METRIC_QUESTIONS = {
  monthly_revenue: "What's our revenue this month?",
  pipeline_value: "Show me the current sales pipeline",
  open_tickets: "How many support tickets are currently open?",
  overdue_receivables: "Which invoices are overdue?",
};

export default function KPICard({ metric }) {
  const navigate = useNavigate();
  const { metric_key, value, change, trend, label } = metric;

  const sparklineData = SPARKLINE_DATA[metric_key] || [];
  const displayLabel = label || METRIC_LABELS[metric_key] || metric_key;
  const question = METRIC_QUESTIONS[metric_key] || `Tell me about ${displayLabel}`;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up'
    ? (metric_key === 'open_tickets' || metric_key === 'overdue_receivables' ? 'text-red-500' : 'text-green-600')
    : trend === 'down'
    ? (metric_key === 'open_tickets' || metric_key === 'overdue_receivables' ? 'text-green-600' : 'text-red-500')
    : 'text-gray-500';

  const sparklineColor = trend === 'up' ? '#4f46e5' : trend === 'down' ? '#ef4444' : '#6b7280';

  const handleClick = () => {
    navigate('/chat', { state: { initialMessage: question } });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white rounded-2xl border border-gray-200 p-5 text-left hover:border-indigo-300 hover:shadow-md transition-all duration-200 group w-full"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">{displayLabel}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">{value || '—'}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-1 ${trendColor}`}>
              <TrendIcon size={14} />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        {sparklineData.length > 0 && (
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={sparklineColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </button>
  );
}
