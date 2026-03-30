import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

function formatCurrency(value) {
  if (typeof value === 'number') {
    return `£${value.toLocaleString('en-GB')}`;
  }
  return value;
}

function generatePDFHtml(question, answer, chartType, chartData, dateRange) {
  const now = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  let chartSection = '';
  if (chartData && chartType) {
    if (chartType === 'table' && chartData.columns && chartData.rows) {
      const headers = chartData.columns.map(c => `<th>${c}</th>`).join('');
      const rows = chartData.rows.map(row =>
        `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
      ).join('');
      chartSection = `
        <h3>Data Table</h3>
        <table class="data-table">
          <thead><tr>${headers}</tr></thead>
          <tbody>${rows}</tbody>
        </table>`;
    } else if (chartType === 'kpi' && chartData.value) {
      const trendSymbol = chartData.trend === 'up' ? '▲' : chartData.trend === 'down' ? '▼' : '→';
      const trendColor = chartData.trend === 'up' ? '#16a34a' : chartData.trend === 'down' ? '#dc2626' : '#6b7280';
      chartSection = `
        <div class="kpi-block">
          <div class="kpi-value">${chartData.value}</div>
          <div class="kpi-change" style="color: ${trendColor}">${trendSymbol} ${chartData.change || ''}</div>
        </div>`;
    } else if (chartData.data && Array.isArray(chartData.data)) {
      const tableRows = chartData.data.map(item => {
        const cells = Object.entries(item)
          .map(([k, v]) => `<td>${typeof v === 'number' && v > 1000 ? formatCurrency(v) : v}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      const headers = Object.keys(chartData.data[0] || {}).map(k => `<th>${k}</th>`).join('');
      chartSection = `
        <h3>Supporting Data</h3>
        <table class="data-table">
          <thead><tr>${headers}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>`;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CEO Intelligence Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a2e;
      background: #fff;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 2px solid #e5e7eb;
      margin-bottom: 32px;
    }
    .logo { font-size: 20px; font-weight: 700; color: #1a1a2e; }
    .logo span { color: #4f46e5; }
    .meta { text-align: right; font-size: 13px; color: #6b7280; }
    .question-block {
      background: #f8f9ff;
      border-left: 4px solid #4f46e5;
      padding: 16px 20px;
      margin-bottom: 24px;
      border-radius: 0 8px 8px 0;
    }
    .question-label { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #4f46e5; margin-bottom: 6px; letter-spacing: 0.05em; }
    .question-text { font-size: 16px; color: #1a1a2e; font-weight: 500; }
    .answer-block { margin-bottom: 32px; }
    .answer-block h2 { font-size: 14px; font-weight: 600; text-transform: uppercase; color: #6b7280; margin-bottom: 12px; letter-spacing: 0.05em; }
    .answer-text { font-size: 15px; line-height: 1.7; color: #374151; }
    .kpi-block { text-align: center; padding: 32px; background: #f8f9ff; border-radius: 12px; margin: 24px 0; }
    .kpi-value { font-size: 48px; font-weight: 700; color: #1a1a2e; }
    .kpi-change { font-size: 20px; font-weight: 600; margin-top: 8px; }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin-top: 12px;
    }
    .data-table th {
      background: #f3f4f6;
      padding: 10px 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    .data-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
    }
    h3 { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; margin-top: 24px; }
    @media print {
      body { padding: 20px; }
      .header { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">CEO <span>Intelligence</span></div>
    <div class="meta">
      <div>Generated: ${now}</div>
      ${dateRange ? `<div>Period: ${dateRange}</div>` : ''}
      <div>Confidential — Executive Use Only</div>
    </div>
  </div>

  <div class="question-block">
    <div class="question-label">Query</div>
    <div class="question-text">${question || 'Business Intelligence Report'}</div>
  </div>

  <div class="answer-block">
    <h2>Executive Summary</h2>
    <div class="answer-text">${answer || 'No analysis available.'}</div>
  </div>

  ${chartSection}

  <div class="footer">
    <span>CEO Intelligence Platform</span>
    <span>Powered by Anthropic Claude + Zoho</span>
  </div>
</body>
</html>`;
}

function generateCSV(chartData) {
  if (!chartData) return 'No data available';

  if (chartData.columns && chartData.rows) {
    const header = chartData.columns.join(',');
    const rows = chartData.rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    return `${header}\n${rows}`;
  }

  if (chartData.data && Array.isArray(chartData.data) && chartData.data.length > 0) {
    const keys = Object.keys(chartData.data[0]);
    const header = keys.join(',');
    const rows = chartData.data.map(item =>
      keys.map(k => {
        const val = item[k];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    ).join('\n');
    return `${header}\n${rows}`;
  }

  if (chartData.value) {
    return `Metric,Value,Change,Trend\nKPI,${chartData.value},${chartData.change || ''},${chartData.trend || ''}`;
  }

  return 'No structured data available';
}

// POST /api/reports/pdf - Generate HTML report (printable)
router.post('/pdf', authMiddleware, (req, res) => {
  const { question, answer, chartType, chartData, dateRange } = req.body;

  const html = generatePDFHtml(question, answer, chartType, chartData, dateRange);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="ceo-report-${Date.now()}.html"`);
  res.send(html);
});

// POST /api/reports/csv - Generate CSV
router.post('/csv', authMiddleware, (req, res) => {
  const { chartData } = req.body;

  const csv = generateCSV(chartData);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="ceo-data-${Date.now()}.csv"`);
  res.send(csv);
});

export default router;
