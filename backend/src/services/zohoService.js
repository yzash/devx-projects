import axios from 'axios';

const ZOHO_ACCOUNTS_URL = 'https://accounts.zoho.com';
const ZOHO_CRM_URL = 'https://www.zohoapis.com/crm/v3';
const ZOHO_BOOKS_URL = 'https://www.zohoapis.com/books/v3';
const ZOHO_DESK_URL = 'https://desk.zoho.com/api/v1';
const ZOHO_INVENTORY_URL = 'https://www.zohoapis.com/inventory/v1';

const isDemoMode = () => !process.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID === 'demo';

export function getZohoAuthUrl() {
  const params = new URLSearchParams({
    scope: 'ZohoCRM.modules.ALL,ZohoBooks.fullaccess.all,Desk.tickets.ALL,ZohoInventory.fullaccess.all',
    client_id: process.env.ZOHO_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.ZOHO_REDIRECT_URI || 'http://localhost:3001/auth/callback',
    access_type: 'offline',
    prompt: 'consent'
  });
  return `${ZOHO_ACCOUNTS_URL}/oauth/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code) {
  const response = await axios.post(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, null, {
    params: {
      grant_type: 'authorization_code',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      redirect_uri: process.env.ZOHO_REDIRECT_URI || 'http://localhost:3001/auth/callback',
      code
    }
  });
  return response.data;
}

export async function refreshAccessToken(refreshToken) {
  if (isDemoMode()) {
    return 'demo-access-token';
  }
  const response = await axios.post(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, null, {
    params: {
      grant_type: 'refresh_token',
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: refreshToken
    }
  });
  return response.data.access_token;
}

export function getDateRange(dateRangeKey) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed, so 2 = March

  switch (dateRangeKey) {
    case 'this_month': {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }
    case 'last_month': {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }
    case 'this_quarter': {
      const quarterStart = Math.floor(month / 3) * 3;
      const start = new Date(year, quarterStart, 1);
      const end = new Date(year, quarterStart + 3, 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }
    case 'last_quarter': {
      const currentQuarterStart = Math.floor(month / 3) * 3;
      const lastQuarterStart = currentQuarterStart - 3;
      const start = new Date(year, lastQuarterStart, 1);
      const end = new Date(year, lastQuarterStart + 3, 0);
      return { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] };
    }
    case 'ytd': {
      return { start: `${year}-01-01`, end: today.toISOString().split('T')[0] };
    }
    case 'last_12_months': {
      const start = new Date(year - 1, month + 1, 1);
      return { start: start.toISOString().split('T')[0], end: today.toISOString().split('T')[0] };
    }
    default:
      return { start: `${year}-01-01`, end: today.toISOString().split('T')[0] };
  }
}

// ─── Mock data generators ────────────────────────────────────────────────────

function getMockPipeline(input) {
  const allDeals = [
    { id: 'D001', name: 'Enterprise Cloud Migration - TechCorp', stage: 'Negotiation', amount: 485000, owner: 'Sarah Chen', close_date: '2026-03-31', probability: 80 },
    { id: 'D002', name: 'SaaS Platform Renewal - Meridian', stage: 'Proposal', amount: 320000, owner: 'James Wright', close_date: '2026-04-15', probability: 60 },
    { id: 'D003', name: 'Security Suite - FinanceHub', stage: 'Closed Won', amount: 275000, owner: 'Sarah Chen', close_date: '2026-03-20', probability: 100 },
    { id: 'D004', name: 'Data Analytics Package - GlobalRetail', stage: 'Value Proposition', amount: 190000, owner: 'Marcus Lee', close_date: '2026-05-01', probability: 40 },
    { id: 'D005', name: 'CRM Integration - MedTech Solutions', stage: 'Qualification', amount: 85000, owner: 'Priya Patel', close_date: '2026-05-30', probability: 20 },
    { id: 'D006', name: 'Managed Services - IndustrialGroup', stage: 'Proposal', amount: 420000, owner: 'James Wright', close_date: '2026-04-20', probability: 65 },
    { id: 'D007', name: 'Cloud Backup Solution - SmallBiz Co', stage: 'Closed Won', amount: 52000, owner: 'Marcus Lee', close_date: '2026-03-15', probability: 100 },
    { id: 'D008', name: 'Network Overhaul - HealthCare Ltd', stage: 'Identify Decision Makers', amount: 310000, owner: 'Priya Patel', close_date: '2026-06-15', probability: 30 },
    { id: 'D009', name: 'AI Consulting - StartupXYZ', stage: 'Perception Analysis', amount: 125000, owner: 'Sarah Chen', close_date: '2026-04-30', probability: 50 },
    { id: 'D010', name: 'ERP Upgrade - ManufacturingCo', stage: 'Negotiation', amount: 560000, owner: 'James Wright', close_date: '2026-04-05', probability: 85 },
    { id: 'D011', name: 'Compliance Platform - LegalFirm', stage: 'Closed Lost', amount: 180000, owner: 'Marcus Lee', close_date: '2026-02-28', probability: 0 },
    { id: 'D012', name: 'DevOps Toolchain - AgileAgency', stage: 'Qualification', amount: 95000, owner: 'Priya Patel', close_date: '2026-06-01', probability: 20 },
    { id: 'D013', name: 'IoT Infrastructure - SmartCity', stage: 'Proposal', amount: 890000, owner: 'Sarah Chen', close_date: '2026-05-15', probability: 55 },
    { id: 'D014', name: 'Customer Portal - RetailChain', stage: 'Value Proposition', amount: 145000, owner: 'Marcus Lee', close_date: '2026-05-10', probability: 45 },
    { id: 'D015', name: 'Business Intelligence - InsuranceCo', stage: 'Closed Won', amount: 230000, owner: 'James Wright', close_date: '2026-03-25', probability: 100 },
  ];

  let deals = allDeals;
  if (input.stage) {
    deals = deals.filter(d => d.stage === input.stage);
  }
  if (input.owner) {
    deals = deals.filter(d => d.owner.toLowerCase().includes(input.owner.toLowerCase()));
  }

  const stageGroups = {};
  for (const deal of deals) {
    if (!stageGroups[deal.stage]) {
      stageGroups[deal.stage] = { stage: deal.stage, count: 0, total_value: 0, deals: [] };
    }
    stageGroups[deal.stage].count++;
    stageGroups[deal.stage].total_value += deal.amount;
    stageGroups[deal.stage].deals.push(deal);
  }

  return {
    total_deals: deals.length,
    total_value: deals.reduce((s, d) => s + d.amount, 0),
    weighted_value: deals.reduce((s, d) => s + (d.amount * d.probability / 100), 0),
    by_stage: Object.values(stageGroups),
    deals: deals
  };
}

function getMockLeads(input) {
  const leads = [
    { id: 'L001', name: 'Alice Thompson', company: 'TechStart Inc', source: 'Web', status: 'Qualified', created_date: '2026-03-01', converted: false },
    { id: 'L002', name: 'Bob Martinez', company: 'Digital Dynamics', source: 'Referral', status: 'Contacted', created_date: '2026-03-05', converted: true },
    { id: 'L003', name: 'Carol Singh', company: 'Innovation Labs', source: 'Trade Show', status: 'New', created_date: '2026-03-10', converted: false },
    { id: 'L004', name: 'David Park', company: 'Cloud Solutions', source: 'Cold Call', status: 'Qualified', created_date: '2026-03-12', converted: false },
    { id: 'L005', name: 'Emma Wilson', company: 'DataFlow Corp', source: 'Web', status: 'Lost', created_date: '2026-02-20', converted: false },
    { id: 'L006', name: 'Frank O\'Brien', company: 'SecureNet', source: 'LinkedIn', status: 'New', created_date: '2026-03-18', converted: false },
    { id: 'L007', name: 'Grace Kim', company: 'Analytics Plus', source: 'Referral', status: 'Contacted', created_date: '2026-03-20', converted: true },
    { id: 'L008', name: 'Henry Zhang', company: 'MegaCorp', source: 'Web', status: 'Qualified', created_date: '2026-03-22', converted: false },
    { id: 'L009', name: 'Isabella Brown', company: 'SmartTech', source: 'Trade Show', status: 'New', created_date: '2026-03-25', converted: false },
    { id: 'L010', name: 'Jack Davis', company: 'FutureSoft', source: 'Cold Call', status: 'Contacted', created_date: '2026-03-28', converted: false },
    { id: 'L011', name: 'Kate Adams', company: 'PlatformX', source: 'LinkedIn', status: 'Qualified', created_date: '2026-02-15', converted: true },
    { id: 'L012', name: 'Liam Johnson', company: 'BuildTools', source: 'Web', status: 'Lost', created_date: '2026-02-10', converted: false },
  ];

  let filtered = leads;
  if (input.source) filtered = filtered.filter(l => l.source.toLowerCase() === input.source.toLowerCase());
  if (input.status) filtered = filtered.filter(l => l.status.toLowerCase() === input.status.toLowerCase());

  const bySource = {};
  const byStatus = {};
  for (const lead of filtered) {
    bySource[lead.source] = (bySource[lead.source] || 0) + 1;
    byStatus[lead.status] = (byStatus[lead.status] || 0) + 1;
  }

  const converted = filtered.filter(l => l.converted).length;

  return {
    total_leads: filtered.length,
    converted: converted,
    conversion_rate: filtered.length ? ((converted / filtered.length) * 100).toFixed(1) : 0,
    by_source: Object.entries(bySource).map(([source, count]) => ({ source, count })),
    by_status: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
    leads: filtered
  };
}

function getMockRevenue(input) {
  const granularity = input.granularity || 'monthly';
  const monthlyData = [
    { period: 'Oct 2025', revenue: 824500, invoices: 47, cost: 512000 },
    { period: 'Nov 2025', revenue: 976200, invoices: 53, cost: 598000 },
    { period: 'Dec 2025', revenue: 1142800, invoices: 61, cost: 682000 },
    { period: 'Jan 2026', revenue: 987300, invoices: 55, cost: 621000 },
    { period: 'Feb 2026', revenue: 1053600, invoices: 58, cost: 644000 },
    { period: 'Mar 2026', revenue: 892100, invoices: 49, cost: 567000 },
  ];

  const totalRevenue = monthlyData.reduce((s, m) => s + m.revenue, 0);
  const totalInvoices = monthlyData.reduce((s, m) => s + m.invoices, 0);
  const prevTotal = 5120000;
  const growthRate = (((totalRevenue - prevTotal) / prevTotal) * 100).toFixed(1);

  return {
    total_revenue: totalRevenue,
    total_invoices: totalInvoices,
    average_monthly: Math.round(totalRevenue / monthlyData.length),
    growth_rate: `${growthRate}%`,
    currency: 'GBP',
    data: monthlyData,
    granularity
  };
}

function getMockReceivables(input) {
  const invoices = [
    { id: 'INV-2026-001', customer: 'TechCorp Solutions', amount: 85000, due_date: '2026-03-15', status: 'Overdue', days_overdue: 15 },
    { id: 'INV-2026-002', customer: 'Meridian Group', amount: 42500, due_date: '2026-03-28', status: 'Overdue', days_overdue: 2 },
    { id: 'INV-2026-003', customer: 'FinanceHub Ltd', amount: 127000, due_date: '2026-04-10', status: 'Current', days_overdue: 0 },
    { id: 'INV-2026-004', customer: 'GlobalRetail Inc', amount: 63800, due_date: '2026-04-15', status: 'Current', days_overdue: 0 },
    { id: 'INV-2026-005', customer: 'IndustrialGroup', amount: 215000, due_date: '2026-04-20', status: 'Current', days_overdue: 0 },
    { id: 'INV-2025-098', customer: 'OldClient Corp', amount: 34500, due_date: '2026-01-31', status: 'Overdue', days_overdue: 58 },
    { id: 'INV-2026-006', customer: 'StartupXYZ', amount: 18900, due_date: '2026-04-05', status: 'Current', days_overdue: 0 },
    { id: 'INV-2026-007', customer: 'HealthCare Ltd', amount: 95000, due_date: '2026-04-30', status: 'Current', days_overdue: 0 },
  ];

  const filtered = input.overdue_only ? invoices.filter(i => i.status === 'Overdue') : invoices;
  const totalOutstanding = filtered.reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);

  return {
    total_outstanding: totalOutstanding,
    total_overdue: totalOverdue,
    invoice_count: filtered.length,
    aging: {
      current: invoices.filter(i => i.days_overdue === 0).reduce((s, i) => s + i.amount, 0),
      '1_30_days': invoices.filter(i => i.days_overdue > 0 && i.days_overdue <= 30).reduce((s, i) => s + i.amount, 0),
      '31_60_days': invoices.filter(i => i.days_overdue > 30 && i.days_overdue <= 60).reduce((s, i) => s + i.amount, 0),
      '60_plus_days': invoices.filter(i => i.days_overdue > 60).reduce((s, i) => s + i.amount, 0),
    },
    invoices: filtered
  };
}

function getMockDeskMetrics(input) {
  return {
    date_range: input.date_range || 'this_month',
    total_tickets: 387,
    open_tickets: 43,
    resolved_tickets: 312,
    pending_tickets: 32,
    avg_resolution_time_hours: 8.4,
    avg_first_response_minutes: 22,
    satisfaction_score: 4.6,
    satisfaction_total_responses: 198,
    by_priority: [
      { priority: 'Urgent', count: 28, avg_resolution_hours: 3.2 },
      { priority: 'High', count: 94, avg_resolution_hours: 6.8 },
      { priority: 'Medium', count: 183, avg_resolution_hours: 9.1 },
      { priority: 'Low', count: 82, avg_resolution_hours: 14.5 },
    ],
    by_agent: [
      { agent: 'Emma Roberts', tickets_resolved: 78, avg_resolution_hours: 7.2, satisfaction: 4.8 },
      { agent: 'Tom Bradley', tickets_resolved: 65, avg_resolution_hours: 8.9, satisfaction: 4.5 },
      { agent: 'Lisa Nguyen', tickets_resolved: 82, avg_resolution_hours: 7.8, satisfaction: 4.7 },
      { agent: 'Sam Okafor', tickets_resolved: 57, avg_resolution_hours: 9.6, satisfaction: 4.4 },
      { agent: 'Amy Chen', tickets_resolved: 30, avg_resolution_hours: 11.2, satisfaction: 4.3 },
    ],
    weekly_trend: [
      { week: 'W1 Mar', new: 98, resolved: 91 },
      { week: 'W2 Mar', new: 104, resolved: 99 },
      { week: 'W3 Mar', new: 87, resolved: 82 },
      { week: 'W4 Mar', new: 98, resolved: 40 },
    ]
  };
}

function getMockInventory(input) {
  const items = [
    { sku: 'PRD-001', name: 'Enterprise License Pack', category: 'Software', stock: 250, reorder_point: 50, unit_price: 1200, status: 'In Stock' },
    { sku: 'PRD-002', name: 'ProServer x64', category: 'Hardware', stock: 8, reorder_point: 15, unit_price: 4500, status: 'Below Reorder' },
    { sku: 'PRD-003', name: 'Network Switch 48-Port', category: 'Hardware', stock: 3, reorder_point: 10, unit_price: 2800, status: 'Below Reorder' },
    { sku: 'PRD-004', name: 'Security Suite Annual', category: 'Software', stock: 180, reorder_point: 30, unit_price: 850, status: 'In Stock' },
    { sku: 'PRD-005', name: 'Backup Appliance 10TB', category: 'Hardware', stock: 12, reorder_point: 8, unit_price: 6200, status: 'In Stock' },
    { sku: 'PRD-006', name: 'Cloud Storage 1TB/yr', category: 'Cloud', stock: 500, reorder_point: 100, unit_price: 240, status: 'In Stock' },
    { sku: 'PRD-007', name: 'Managed Firewall', category: 'Hardware', stock: 5, reorder_point: 10, unit_price: 3400, status: 'Below Reorder' },
    { sku: 'PRD-008', name: 'Developer Seats Pack', category: 'Software', stock: 95, reorder_point: 20, unit_price: 2100, status: 'In Stock' },
    { sku: 'PRD-009', name: 'Support Contract Gold', category: 'Services', stock: 75, reorder_point: 10, unit_price: 5500, status: 'In Stock' },
    { sku: 'PRD-010', name: 'IoT Sensor Module', category: 'Hardware', stock: 2, reorder_point: 25, unit_price: 380, status: 'Critical' },
    { sku: 'PRD-011', name: 'Analytics Dashboard', category: 'Software', stock: 320, reorder_point: 50, unit_price: 1800, status: 'In Stock' },
    { sku: 'PRD-012', name: 'Training Bundle', category: 'Services', stock: 40, reorder_point: 15, unit_price: 1500, status: 'In Stock' },
  ];

  let filtered = items;
  if (input.below_reorder) {
    filtered = filtered.filter(i => i.stock <= i.reorder_point);
  }
  if (input.category) {
    filtered = filtered.filter(i => i.category.toLowerCase() === input.category.toLowerCase());
  }

  const totalValue = filtered.reduce((s, i) => s + (i.stock * i.unit_price), 0);
  const belowReorderItems = items.filter(i => i.stock <= i.reorder_point);

  return {
    total_items: filtered.length,
    total_inventory_value: totalValue,
    below_reorder_count: belowReorderItems.length,
    critical_count: items.filter(i => i.stock < i.reorder_point * 0.3).length,
    items: filtered,
    by_category: [...new Set(items.map(i => i.category))].map(cat => ({
      category: cat,
      count: items.filter(i => i.category === cat).length,
      value: items.filter(i => i.category === cat).reduce((s, i) => s + (i.stock * i.unit_price), 0)
    }))
  };
}

function getMockAnalyticsReport(input) {
  return {
    view_id: input.view_id,
    date_range: input.date_range,
    report_name: `Analytics Report ${input.view_id}`,
    data: [
      { metric: 'Monthly Recurring Revenue', value: '£892,100', change: '+7.2%' },
      { metric: 'Customer Acquisition Cost', value: '£1,240', change: '-5.1%' },
      { metric: 'Customer Lifetime Value', value: '£18,500', change: '+12.3%' },
      { metric: 'Net Revenue Retention', value: '108%', change: '+3%' },
      { metric: 'Churn Rate', value: '2.1%', change: '-0.4%' },
    ]
  };
}

// ─── Main tool executor ───────────────────────────────────────────────────────

export async function executeTool(toolName, toolInput, accessToken) {
  // Always use mock data in demo mode or when real API fails
  if (isDemoMode() || !accessToken || accessToken === 'demo-access-token') {
    return executeToolMock(toolName, toolInput);
  }

  try {
    return await executeToolReal(toolName, toolInput, accessToken);
  } catch (err) {
    console.warn(`Real Zoho API call failed for ${toolName}, falling back to mock:`, err.message);
    return executeToolMock(toolName, toolInput);
  }
}

function executeToolMock(toolName, toolInput) {
  switch (toolName) {
    case 'get_crm_pipeline': return getMockPipeline(toolInput);
    case 'get_crm_leads': return getMockLeads(toolInput);
    case 'get_books_revenue': return getMockRevenue(toolInput);
    case 'get_books_receivables': return getMockReceivables(toolInput);
    case 'get_desk_metrics': return getMockDeskMetrics(toolInput);
    case 'get_inventory_status': return getMockInventory(toolInput);
    case 'get_analytics_report': return getMockAnalyticsReport(toolInput);
    default: throw new Error(`Unknown tool: ${toolName}`);
  }
}

async function executeToolReal(toolName, toolInput, accessToken) {
  const headers = { Authorization: `Zoho-oauthtoken ${accessToken}` };
  const orgId = process.env.ZOHO_ORG_ID;

  switch (toolName) {
    case 'get_crm_pipeline': {
      const { start, end } = getDateRange(toolInput.date_range || 'this_quarter');
      const params = { criteria: `(Close_Date:between:${start},${end})` };
      if (toolInput.stage) params.criteria += `:and:(Stage:equals:${toolInput.stage})`;
      const res = await axios.get(`${ZOHO_CRM_URL}/Deals`, { headers, params });
      return res.data;
    }
    case 'get_crm_leads': {
      const { start, end } = getDateRange(toolInput.date_range || 'this_month');
      const res = await axios.get(`${ZOHO_CRM_URL}/Leads`, {
        headers,
        params: { criteria: `(Created_Time:between:${start},${end})` }
      });
      return res.data;
    }
    case 'get_books_revenue': {
      const { start, end } = getDateRange(toolInput.date_range);
      const res = await axios.get(`${ZOHO_BOOKS_URL}/reports/cashflow`, {
        headers: { ...headers, 'X-com-zoho-books-organizationid': orgId },
        params: { from_date: start, to_date: end }
      });
      return res.data;
    }
    case 'get_books_receivables': {
      const res = await axios.get(`${ZOHO_BOOKS_URL}/reports/agedreceivables`, {
        headers: { ...headers, 'X-com-zoho-books-organizationid': orgId }
      });
      return res.data;
    }
    case 'get_desk_metrics': {
      const res = await axios.get(`${ZOHO_DESK_URL}/reports/overview`, { headers });
      return res.data;
    }
    case 'get_inventory_status': {
      const params = {};
      if (toolInput.below_reorder) params.reorder_level = true;
      const res = await axios.get(`${ZOHO_INVENTORY_URL}/items`, {
        headers: { ...headers, 'X-com-zoho-inventory-organizationid': orgId },
        params
      });
      return res.data;
    }
    case 'get_analytics_report': {
      const res = await axios.get(`https://analyticsapi.zoho.com/restapi/v2/views/${toolInput.view_id}/data`, {
        headers
      });
      return res.data;
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
