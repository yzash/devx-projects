/**
 * Zoho tool definitions for Claude function calling (tool_use).
 * Each tool follows the Anthropic tool_use format.
 */

const DATE_RANGE_ENUM = [
  'this_month',
  'last_month',
  'this_quarter',
  'last_quarter',
  'ytd',
  'last_12_months'
];

const PIPELINE_STAGE_ENUM = [
  'Qualification',
  'Value Proposition',
  'Identify Decision Makers',
  'Perception Analysis',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

export const ZOHO_TOOLS = [
  {
    name: 'get_crm_pipeline',
    description: 'Retrieves CRM pipeline data from Zoho CRM. Returns deals grouped by stage with total values, counts, and owner information. Use this for questions about sales pipeline, deal stages, projected revenue, or pipeline health.',
    input_schema: {
      type: 'object',
      properties: {
        stage: {
          type: 'string',
          enum: PIPELINE_STAGE_ENUM,
          description: 'Filter by a specific pipeline stage. Omit to get all stages.'
        },
        date_range: {
          type: 'string',
          enum: DATE_RANGE_ENUM,
          description: 'Time period to filter deals by close date. Defaults to this_quarter if omitted.'
        },
        owner: {
          type: 'string',
          description: 'Filter by deal owner name or ID. Omit to get all owners.'
        }
      },
      required: []
    }
  },
  {
    name: 'get_crm_leads',
    description: 'Retrieves lead data from Zoho CRM. Returns leads with source, status, conversion rates, and counts. Use this for questions about lead generation, lead quality, or marketing effectiveness.',
    input_schema: {
      type: 'object',
      properties: {
        source: {
          type: 'string',
          description: 'Filter by lead source (e.g., "Web", "Cold Call", "Referral", "Trade Show")'
        },
        status: {
          type: 'string',
          description: 'Filter by lead status (e.g., "New", "Contacted", "Qualified", "Lost")'
        },
        date_range: {
          type: 'string',
          enum: DATE_RANGE_ENUM,
          description: 'Time period for lead creation date.'
        }
      },
      required: []
    }
  },
  {
    name: 'get_books_revenue',
    description: 'Retrieves revenue and invoicing data from Zoho Books. Returns total revenue, invoice counts, and trends over time. Use this for questions about revenue, sales figures, financial performance, or income.',
    input_schema: {
      type: 'object',
      properties: {
        date_range: {
          type: 'string',
          enum: DATE_RANGE_ENUM,
          description: 'Time period for revenue data.'
        },
        granularity: {
          type: 'string',
          enum: ['daily', 'weekly', 'monthly'],
          description: 'Data granularity for trend charts. Defaults to monthly.'
        }
      },
      required: ['date_range']
    }
  },
  {
    name: 'get_books_receivables',
    description: 'Retrieves accounts receivable data from Zoho Books. Returns outstanding invoices, overdue amounts, and aging buckets. Use this for questions about cash flow, outstanding payments, or overdue invoices.',
    input_schema: {
      type: 'object',
      properties: {
        overdue_only: {
          type: 'boolean',
          description: 'If true, only return overdue invoices. Defaults to false (returns all outstanding).'
        }
      },
      required: []
    }
  },
  {
    name: 'get_desk_metrics',
    description: 'Retrieves customer support metrics from Zoho Desk. Returns ticket volumes, resolution times, satisfaction scores, and agent performance. Use this for questions about customer support, service levels, or support team performance.',
    input_schema: {
      type: 'object',
      properties: {
        date_range: {
          type: 'string',
          enum: DATE_RANGE_ENUM,
          description: 'Time period for support metrics.'
        },
        agent_id: {
          type: 'string',
          description: 'Filter by specific agent ID or name. Omit for all agents.'
        }
      },
      required: []
    }
  },
  {
    name: 'get_inventory_status',
    description: 'Retrieves inventory status from Zoho Inventory. Returns stock levels, reorder alerts, top-selling items, and category summaries. Use this for questions about stock, inventory levels, or product availability.',
    input_schema: {
      type: 'object',
      properties: {
        below_reorder: {
          type: 'boolean',
          description: 'If true, only return items that are at or below their reorder point.'
        },
        category: {
          type: 'string',
          description: 'Filter by product category name.'
        }
      },
      required: []
    }
  },
  {
    name: 'get_analytics_report',
    description: 'Retrieves a specific analytics report from Zoho Analytics. Use this for custom reports, advanced data views, or cross-module analytics that are pre-configured in Zoho Analytics.',
    input_schema: {
      type: 'object',
      properties: {
        view_id: {
          type: 'string',
          description: 'The Zoho Analytics view/report ID to retrieve.'
        },
        date_range: {
          type: 'string',
          enum: DATE_RANGE_ENUM,
          description: 'Time period for the analytics report.'
        }
      },
      required: ['view_id', 'date_range']
    }
  }
];
