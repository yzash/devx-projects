export function formatCurrency(value, currency = 'GBP') {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  if (isNaN(num)) return String(value);
  
  const symbol = currency === 'GBP' ? '£' : '$';
  if (Math.abs(num) >= 1_000_000) {
    return `${symbol}${(num / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(num) >= 1_000) {
    return `${symbol}${(num / 1_000).toFixed(0)}K`;
  }
  return `${symbol}${num.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return num.toLocaleString('en-GB');
}

export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  return `${num.toFixed(decimals)}%`;
}

export function formatDate(dateString, options = {}) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options
    });
  } catch (_) {
    return String(dateString);
  }
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  } catch (_) {
    return '';
  }
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
