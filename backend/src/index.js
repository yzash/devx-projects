import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDB } from './config/db.js';
import authRouter from './routes/auth.js';
import queryRouter from './routes/query.js';
import reportsRouter from './routes/reports.js';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware — accept localhost in dev and any Vercel deployment URL in prod
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // non-browser / same-origin
    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    cb(allowed ? null : new Error('CORS: origin not allowed'), allowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRouter);
app.use('/api', queryRouter);
app.use('/api/reports', reportsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server — local dev only (Vercel uses the exported app directly)
if (!process.env.VERCEL) {
  const start = async () => {
    try {
      await initDB();
      console.log('Database initialized');
    } catch (err) {
      console.warn('Database not available, running without persistence:', err.message);
    }
    app.listen(PORT, () => {
      console.log(`CEO Intelligence Backend running on http://localhost:${PORT}`);
      console.log(`Demo mode: ${!process.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID === 'demo' ? 'ON' : 'OFF'}`);
    });
  };
  start();
} else {
  // On Vercel: init DB non-blocking, then export
  initDB().catch(err => console.warn('DB init skipped:', err.message));
}

export default app;
