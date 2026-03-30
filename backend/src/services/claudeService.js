import Groq from 'groq-sdk';
import { ZOHO_TOOLS } from '../tools/zoho_tools.js';
import { executeTool } from './zohoService.js';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'demo'
});

// Model: llama-3.3-70b-versatile — best Llama model on Groq for function calling
const MODEL = 'llama-3.3-70b-versatile';

const currentDate = new Date().toISOString().split('T')[0];

const SYSTEM_PROMPT = `You are an executive business intelligence assistant for a CEO. Your role is to interpret natural language questions about business performance and retrieve accurate data from Zoho CRM, Books, Desk, and Inventory.

Today's date is ${currentDate}.

When answering:
1. First identify which Zoho module(s) contain the relevant data
2. Call the appropriate tool(s) to retrieve that data
3. Analyze the data and provide an executive-level answer
4. Lead with the headline metric, then provide context and trends
5. Be concise and insight-first — the CEO wants the answer, not the process

After analysis, respond with a JSON object (no markdown code blocks, pure JSON only):
{
  "answer": "Your executive-level prose answer here",
  "chartType": "bar|line|pie|table|kpi",
  "chartData": { ... recharts-compatible data },
  "followUps": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
}

Chart data format:
- For bar/line: { data: [{name: "...", value: N, ...}], xKey: "name", yKeys: ["value"] }
- For pie: { data: [{name: "...", value: N}] }
- For table: { columns: ["Col1", "Col2"], rows: [["v1", "v2"]] }
- For kpi: { value: "£2.4M", change: "+12%", trend: "up|down|flat" }

Tone: Executive-level, concise, insight-first. Use currency symbols (£ or $) appropriately.
IMPORTANT: Your final response must be valid JSON only — no markdown, no code fences, no preamble.`;

function parseLlamaResponse(text) {
  const trimmed = text.trim();

  // Strip markdown code fences if present
  const stripped = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  try {
    return JSON.parse(stripped);
  } catch (_) {}

  // Try to find a JSON object in the text
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (_) {}
  }

  // Fallback: treat the whole thing as a plain answer
  return {
    answer: text,
    chartType: null,
    chartData: null,
    followUps: []
  };
}

export async function* processQuery(message, conversationHistory = [], accessToken = null) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message }
  ];

  const zohoModulesQueried = [];
  let continueLoop = true;
  let currentMessages = [...messages];

  const moduleMap = {
    get_crm_pipeline: 'CRM',
    get_crm_leads: 'CRM',
    get_books_revenue: 'Books',
    get_books_receivables: 'Books',
    get_desk_metrics: 'Desk',
    get_inventory_status: 'Inventory',
    get_analytics_report: 'Analytics'
  };

  // Tool use loop
  while (continueLoop) {
    let response;
    try {
      response = await client.chat.completions.create({
        model: MODEL,
        max_tokens: 4096,
        tools: ZOHO_TOOLS,
        tool_choice: 'auto',
        messages: currentMessages
      });
    } catch (err) {
      // Fall back to demo response when API key is missing/invalid
      if (
        err.message?.includes('API key') ||
        err.message?.includes('authentication') ||
        err.message?.includes('Invalid') ||
        err.status === 401
      ) {
        const demoResponse = getDemoResponse(message);
        yield { type: 'text', content: demoResponse.answer };
        yield { type: 'chartData', chartType: demoResponse.chartType, chartData: demoResponse.chartData };
        yield { type: 'followUps', followUps: demoResponse.followUps };
        yield {
          type: 'done',
          zohoModulesQueried: ['mock'],
          answer: demoResponse.answer,
          chartType: demoResponse.chartType,
          chartData: demoResponse.chartData,
          followUps: demoResponse.followUps
        };
        return;
      }
      throw err;
    }

    const choice = response.choices[0];
    const assistantMessage = choice.message;

    if (choice.finish_reason === 'tool_calls' && assistantMessage.tool_calls?.length > 0) {
      // Add assistant message with tool_calls to history
      currentMessages = [...currentMessages, assistantMessage];

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        let toolInput;
        try {
          toolInput = JSON.parse(toolCall.function.arguments);
        } catch (_) {
          toolInput = {};
        }

        yield { type: 'toolCall', toolName, toolInput };

        if (moduleMap[toolName] && !zohoModulesQueried.includes(moduleMap[toolName])) {
          zohoModulesQueried.push(moduleMap[toolName]);
        }

        let toolResult;
        try {
          toolResult = await executeTool(toolName, toolInput, accessToken);
        } catch (err) {
          toolResult = { error: err.message };
        }

        // Add tool result message (role: 'tool' in OpenAI/Groq format)
        currentMessages = [
          ...currentMessages,
          {
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(toolResult)
          }
        ];
      }
    } else {
      // Final text response
      continueLoop = false;
      const rawText = assistantMessage.content || '';
      const parsed = parseLlamaResponse(rawText);

      // Stream the answer in chunks for perceived speed
      if (parsed.answer) {
        const chunkSize = 20;
        for (let i = 0; i < parsed.answer.length; i += chunkSize) {
          yield { type: 'text', content: parsed.answer.slice(i, i + chunkSize) };
        }
      }

      if (parsed.chartData) {
        yield { type: 'chartData', chartType: parsed.chartType, chartData: parsed.chartData };
      }

      if (parsed.followUps?.length > 0) {
        yield { type: 'followUps', followUps: parsed.followUps };
      }

      yield {
        type: 'done',
        zohoModulesQueried,
        answer: parsed.answer,
        chartType: parsed.chartType,
        chartData: parsed.chartData,
        followUps: parsed.followUps || []
      };
    }
  }
}

// Demo responses when Groq API key is not configured
function getDemoResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('revenue') || lowerMessage.includes('sales')) {
    return {
      answer: 'Revenue for Q1 2026 stands at £2.93M, tracking 8.4% ahead of Q1 2025. March is slightly softer at £892K due to seasonal patterns, but February\'s £1.05M was a record month. The 6-month trend shows consistent growth with December 2025 being the peak at £1.14M. Net margin has improved to 34% from 31% a year ago.',
      chartType: 'bar',
      chartData: {
        data: [
          { name: 'Oct 2025', value: 824500 },
          { name: 'Nov 2025', value: 976200 },
          { name: 'Dec 2025', value: 1142800 },
          { name: 'Jan 2026', value: 987300 },
          { name: 'Feb 2026', value: 1053600 },
          { name: 'Mar 2026', value: 892100 }
        ],
        xKey: 'name',
        yKeys: ['value']
      },
      followUps: [
        'Which customers drove the February revenue spike?',
        'What is our revenue forecast for Q2 2026?',
        'How does our gross margin compare to last year?'
      ]
    };
  }

  if (lowerMessage.includes('pipeline') || lowerMessage.includes('deal')) {
    return {
      answer: 'The sales pipeline holds £3.98M across 15 active deals. Two deals in Negotiation stage represent £1.045M of near-term revenue — the ERP Upgrade (£560K, 85% probability) and TechCorp Migration (£485K, 80%) are both expected to close before April. Weighted pipeline value is £1.82M. Three Closed Won deals this month total £557K.',
      chartType: 'bar',
      chartData: {
        data: [
          { name: 'Qualification', value: 180000 },
          { name: 'Value Proposition', value: 335000 },
          { name: 'Decision Makers', value: 310000 },
          { name: 'Perception', value: 125000 },
          { name: 'Proposal', value: 1630000 },
          { name: 'Negotiation', value: 1045000 },
          { name: 'Closed Won', value: 557000 }
        ],
        xKey: 'name',
        yKeys: ['value']
      },
      followUps: [
        'Which deals are at risk of slipping this quarter?',
        'Who is our top-performing sales rep this month?',
        'What is the average deal size by stage?'
      ]
    };
  }

  if (lowerMessage.includes('support') || lowerMessage.includes('ticket') || lowerMessage.includes('desk')) {
    return {
      answer: 'Support is performing well this month: 387 tickets handled with an 80.6% resolution rate. Average resolution time of 8.4 hours is within SLA targets. Customer satisfaction sits at 4.6/5 based on 198 responses. Lisa Nguyen leads the team with 82 resolutions at a 4.7 satisfaction score. 43 tickets remain open, of which 28 are urgent priority.',
      chartType: 'bar',
      chartData: {
        data: [
          { name: 'Urgent', value: 28 },
          { name: 'High', value: 94 },
          { name: 'Medium', value: 183 },
          { name: 'Low', value: 82 }
        ],
        xKey: 'name',
        yKeys: ['value']
      },
      followUps: [
        'What are the most common ticket categories this month?',
        'Which customers are raising the most support tickets?',
        'How has our resolution time trended over the past quarter?'
      ]
    };
  }

  // Default response
  return {
    answer: 'Business performance is strong across all key metrics. Revenue is up 8.4% YoY at £892K this month, the sales pipeline holds £3.98M in active opportunities, customer support satisfaction is 4.6/5, and inventory levels are stable with 3 items requiring reorder attention. The business is on track to exceed Q1 targets.',
    chartType: 'kpi',
    chartData: {
      value: '£892K',
      change: '+8.4%',
      trend: 'up'
    },
    followUps: [
      'Show me this month\'s revenue breakdown',
      'What deals are closing this quarter?',
      'Are there any overdue invoices I should know about?'
    ]
  };
}
