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

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
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

// Start server
async function start() {
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
}

start();
