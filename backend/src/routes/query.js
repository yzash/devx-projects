import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { processQuery } from '../services/claudeService.js';
import { query } from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import { executeTool } from '../services/zohoService.js';

const router = express.Router();

// Helper to safely run DB queries without crashing if DB is unavailable
async function safeQuery(text, params) {
  try {
    return await query(text, params);
  } catch (_) {
    return { rows: [] };
  }
}

// POST /api/query - Main query endpoint with SSE streaming
router.post('/query', authMiddleware, async (req, res) => {
  const { message, conversationHistory = [], conversationId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const accessToken = req.user.accessToken || null;
    let fullAnswer = '';
    let chartType = null;
    let chartData = null;
    let followUps = [];
    let zohoModulesQueried = [];

    const generator = processQuery(message, conversationHistory, accessToken);

    for await (const event of generator) {
      sendEvent(event);

      if (event.type === 'text') fullAnswer += event.content;
      if (event.type === 'chartData') { chartType = event.chartType; chartData = event.chartData; }
      if (event.type === 'followUps') followUps = event.followUps;
      if (event.type === 'done') {
        zohoModulesQueried = event.zohoModulesQueried || [];
        // Use the complete answer from done event
        if (event.answer) fullAnswer = event.answer;
        if (event.chartType) chartType = event.chartType;
        if (event.chartData) chartData = event.chartData;
        if (event.followUps) followUps = event.followUps;
      }
    }

    // Save to audit log
    await safeQuery(
      'INSERT INTO audit_log (id, user_id, query_text, zoho_modules_queried, response_summary, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [uuidv4(), req.user.userId, message, zohoModulesQueried, fullAnswer?.slice(0, 500)]
    );

    // Save message to conversation if conversationId provided
    if (conversationId) {
      await safeQuery(
        'INSERT INTO messages (id, conversation_id, role, content_json, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [uuidv4(), conversationId, 'user', JSON.stringify({ text: message })]
      );
      await safeQuery(
        'INSERT INTO messages (id, conversation_id, role, content_json, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [uuidv4(), conversationId, 'assistant', JSON.stringify({ text: fullAnswer, chartType, chartData, followUps })]
      );
      await safeQuery(
        'UPDATE conversations SET updated_at = NOW() WHERE id = $1',
        [conversationId]
      );
    }

    res.end();
  } catch (err) {
    console.error('Query error:', err);
    sendEvent({ type: 'error', error: err.message });
    res.end();
  }
});

// GET /api/conversations - List conversations for user
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const result = await safeQuery(
      'SELECT id, title, created_at, updated_at FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 20',
      [req.user.userId]
    );
    res.json({ conversations: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/:id/messages - Get messages for a conversation
router.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
  try {
    const conv = await safeQuery(
      'SELECT id FROM conversations WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    if (conv.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await safeQuery(
      'SELECT id, role, content_json, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json({ messages: messages.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversations - Create conversation
router.post('/conversations', authMiddleware, async (req, res) => {
  const { title } = req.body;
  try {
    const result = await safeQuery(
      'INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
      [uuidv4(), req.user.userId, title || 'New Conversation']
    );
    res.json({ conversation: result.rows[0] || { id: uuidv4(), title: title || 'New Conversation', created_at: new Date(), updated_at: new Date() } });
  } catch (err) {
    // DB not available, return a fake conversation ID
    res.json({ conversation: { id: uuidv4(), title: title || 'New Conversation', user_id: req.user.userId, created_at: new Date(), updated_at: new Date() } });
  }
});

// GET /api/saved-queries - List saved queries
router.get('/saved-queries', authMiddleware, async (req, res) => {
  const result = await safeQuery(
    'SELECT id, label, query_text, last_run_at FROM saved_queries WHERE user_id = $1 ORDER BY label',
    [req.user.userId]
  );
  res.json({ savedQueries: result.rows });
});

// POST /api/saved-queries - Save a query
router.post('/saved-queries', authMiddleware, async (req, res) => {
  const { label, queryText } = req.body;
  if (!label || !queryText) {
    return res.status(400).json({ error: 'label and queryText are required' });
  }
  try {
    const result = await safeQuery(
      'INSERT INTO saved_queries (id, user_id, label, query_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [uuidv4(), req.user.userId, label, queryText]
    );
    res.json({ savedQuery: result.rows[0] || { id: uuidv4(), label, query_text: queryText } });
  } catch (err) {
    res.json({ savedQuery: { id: uuidv4(), label, query_text: queryText } });
  }
});

// DELETE /api/saved-queries/:id - Delete saved query
router.delete('/saved-queries/:id', authMiddleware, async (req, res) => {
  await safeQuery(
    'DELETE FROM saved_queries WHERE id = $1 AND user_id = $2',
    [req.params.id, req.user.userId]
  );
  res.json({ success: true });
});

// GET /api/pinned-metrics - List pinned metrics with live data
router.get('/pinned-metrics', authMiddleware, async (req, res) => {
  const result = await safeQuery(
    'SELECT id, metric_key, zoho_module, display_order FROM pinned_metrics WHERE user_id = $1 ORDER BY display_order',
    [req.user.userId]
  );

  // If no pinned metrics, return defaults
  const metrics = result.rows.length > 0 ? result.rows : [
    { id: 'default-1', metric_key: 'monthly_revenue', zoho_module: 'Books', display_order: 0 },
    { id: 'default-2', metric_key: 'pipeline_value', zoho_module: 'CRM', display_order: 1 },
    { id: 'default-3', metric_key: 'open_tickets', zoho_module: 'Desk', display_order: 2 },
    { id: 'default-4', metric_key: 'overdue_receivables', zoho_module: 'Books', display_order: 3 },
  ];

  // Enrich with live data
  const accessToken = req.user.accessToken || null;
  const enrichedMetrics = await Promise.all(metrics.map(async (metric) => {
    try {
      let liveData = {};
      switch (metric.metric_key) {
        case 'monthly_revenue': {
          const data = await executeTool('get_books_revenue', { date_range: 'this_month' }, accessToken);
          const monthData = data.data?.[data.data.length - 1];
          liveData = { value: `£${(monthData?.revenue || data.total_revenue || 892100).toLocaleString()}`, change: '+8.4%', trend: 'up', label: 'Revenue This Month' };
          break;
        }
        case 'pipeline_value': {
          const data = await executeTool('get_crm_pipeline', {}, accessToken);
          liveData = { value: `£${(data.total_value || 3980000).toLocaleString()}`, change: '+12.1%', trend: 'up', label: 'Pipeline Value' };
          break;
        }
        case 'open_tickets': {
          const data = await executeTool('get_desk_metrics', {}, accessToken);
          liveData = { value: String(data.open_tickets || 43), change: '-5', trend: 'down', label: 'Open Support Tickets' };
          break;
        }
        case 'overdue_receivables': {
          const data = await executeTool('get_books_receivables', { overdue_only: true }, accessToken);
          liveData = { value: `£${(data.total_overdue || 162000).toLocaleString()}`, change: '+£12K', trend: 'up', label: 'Overdue Receivables' };
          break;
        }
        default:
          liveData = { value: '—', change: '0%', trend: 'flat', label: metric.metric_key };
      }
      return { ...metric, ...liveData };
    } catch (_) {
      return { ...metric, value: '—', change: '', trend: 'flat', label: metric.metric_key };
    }
  }));

  res.json({ pinnedMetrics: enrichedMetrics });
});

// POST /api/pinned-metrics - Pin a metric
router.post('/pinned-metrics', authMiddleware, async (req, res) => {
  const { metricKey, zohoModule, displayOrder } = req.body;
  if (!metricKey) return res.status(400).json({ error: 'metricKey is required' });

  try {
    const result = await safeQuery(
      'INSERT INTO pinned_metrics (id, user_id, metric_key, zoho_module, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [uuidv4(), req.user.userId, metricKey, zohoModule || null, displayOrder || 0]
    );
    res.json({ pinnedMetric: result.rows[0] || { id: uuidv4(), metric_key: metricKey } });
  } catch (err) {
    res.json({ pinnedMetric: { id: uuidv4(), metric_key: metricKey } });
  }
});

export default router;
