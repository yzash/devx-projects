# CEO Intelligence Platform

An AI-powered business intelligence platform for executives, integrating with Zoho CRM, Books, Desk, and Inventory via natural language queries.

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- (Optional) PostgreSQL 15 or Docker

### 1. Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials (or leave as-is for demo mode)
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

### 3. Run (Demo Mode — no credentials needed)

Terminal 1:
```bash
cd backend && npm run dev
```

Terminal 2:
```bash
cd frontend && npm run dev
```

Open http://localhost:5173

### Demo Mode

The app works out-of-the-box without any Zoho or Claude credentials:
- Authentication is automatic via `/auth/demo`
- All Zoho API calls return realistic mock data
- Claude responses use pre-built templates

To enable real Claude AI responses, add your `ANTHROPIC_API_KEY` to `backend/.env`.

## Configuration

### backend/.env

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API key (get from console.anthropic.com) |
| `ZOHO_CLIENT_ID` | Zoho OAuth app client ID (leave blank for demo) |
| `ZOHO_CLIENT_SECRET` | Zoho OAuth app client secret |
| `ZOHO_REDIRECT_URI` | OAuth callback URL |
| `ZOHO_ORG_ID` | Your Zoho organization ID |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT signing (change in production!) |
| `ENCRYPTION_KEY` | 32-char key for encrypting refresh tokens |
| `PORT` | Backend port (default: 3001) |
| `FRONTEND_URL` | Frontend URL for CORS (default: http://localhost:5173) |

### Database (Optional)

Using Docker:
```bash
docker-compose up -d
```
Then set `DATABASE_URL=postgresql://ceouser:ceopass@localhost:5432/ceo_intelligence` in backend/.env.

Without a database, the app runs in stateless mode (no conversation history persistence).

## Architecture

```
/frontend    React + Vite + Tailwind
  /src
    /components  UI components (ChatWindow, ChartRenderer, KPICard, etc.)
    /pages       Home (dashboard) + Chat
    /contexts    Auth + Conversation state management
    /hooks       useChat (SSE streaming)
    /utils       API client, formatters

/backend     Node.js + Express
  /src
    /config      PostgreSQL + AES-256 encryption
    /middleware  JWT auth
    /routes      auth, query (SSE), reports
    /services    Claude AI + Zoho API integration
    /tools       Claude tool definitions (7 Zoho tools)
```

## Features

- **Natural language queries** — Ask anything about your business in plain English
- **Real-time streaming** — Responses stream via Server-Sent Events
- **Smart charting** — Auto-selects bar/line/pie/table based on data type
- **Zoho integration** — CRM pipeline, Books revenue, Desk tickets, Inventory
- **Export** — Download reports as HTML (printable PDF) or CSV
- **Conversation history** — Persistent chat threads with full context
- **Saved queries** — Bookmark frequently-asked questions
- **KPI dashboard** — Live metric cards with sparklines

## Zoho OAuth Setup

1. Create an app at https://api-console.zoho.com/
2. Set redirect URI to `http://localhost:3001/auth/callback`
3. Add client ID and secret to backend/.env
4. Visit http://localhost:5173 and click "Connect Zoho"
