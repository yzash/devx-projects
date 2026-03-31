import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getZohoAuthUrl, exchangeCodeForTokens } from '../services/zohoService.js';
import { encrypt } from '../config/encryption.js';
import { query } from '../config/db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const isDemoMode = () => !process.env.ZOHO_CLIENT_ID || process.env.ZOHO_CLIENT_ID === 'demo';
const hasStaticToken = () => !!process.env.ZOHO_REFRESH_TOKEN;

// GET /auth/mode - tells frontend how to authenticate
router.get('/mode', (req, res) => {
  if (hasStaticToken()) return res.json({ mode: 'static' });
  if (isDemoMode()) return res.json({ mode: 'demo' });
  res.json({ mode: 'zoho' });
});

// GET /auth/static - auto-login using ZOHO_REFRESH_TOKEN env var (no OAuth flow needed)
router.get('/static', async (req, res) => {
  if (!hasStaticToken()) {
    return res.status(404).json({ error: 'Static token not configured' });
  }
  try {
    let userId = 'static-user-00000000';
    try {
      const existing = await query('SELECT id FROM users WHERE zoho_org_id = $1', [process.env.ZOHO_ORG_ID || 'static']);
      if (existing.rows.length > 0) {
        userId = existing.rows[0].id;
      } else {
        const { encrypt } = await import('../config/encryption.js');
        const result = await query(
          'INSERT INTO users (id, zoho_org_id, refresh_token_encrypted, preferences_json) VALUES ($1, $2, $3, $4) RETURNING id',
          [uuidv4(), process.env.ZOHO_ORG_ID || 'static', encrypt(process.env.ZOHO_REFRESH_TOKEN), JSON.stringify({ currency: 'GBP' })]
        );
        userId = result.rows[0].id;
      }
    } catch (_) {
      // DB unavailable — use a fixed ID
    }

    const token = generateToken({ userId, zohoOrgId: process.env.ZOHO_ORG_ID || 'static', isStatic: true });
    res.json({ success: true, token, user: { id: userId, isStatic: true } });
  } catch (err) {
    console.error('Static auth error:', err);
    res.status(500).json({ error: 'Static authentication failed' });
  }
});

// GET /auth/demo - Auto-authenticate in demo mode (blocked when Zoho is configured)
router.get('/demo', async (req, res) => {
  if (!isDemoMode()) {
    return res.status(403).json({
      error: 'Demo mode is disabled. Please sign in with Zoho.',
      redirect: '/auth/zoho'
    });
  }
  try {
    const demoUserId = 'demo-user-' + uuidv4().slice(0, 8);
    
    // Try to find or create demo user in DB
    let userId = 'demo-user-00000000';
    try {
      const existing = await query('SELECT id FROM users WHERE zoho_org_id = $1', ['demo']);
      if (existing.rows.length > 0) {
        userId = existing.rows[0].id;
      } else {
        const result = await query(
          'INSERT INTO users (id, zoho_org_id, preferences_json) VALUES ($1, $2, $3) RETURNING id',
          [uuidv4(), 'demo', JSON.stringify({ theme: 'dark', currency: 'GBP' })]
        );
        userId = result.rows[0].id;
      }
    } catch (dbErr) {
      // DB not available, use in-memory demo user
      console.warn('DB not available for demo user, using in-memory ID');
    }

    const token = generateToken({
      userId,
      zohoOrgId: 'demo',
      isDemo: true
    });

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        isDemo: true,
        zohoOrgId: 'demo'
      }
    });
  } catch (err) {
    console.error('Demo auth error:', err);
    res.status(500).json({ error: 'Demo authentication failed' });
  }
});

// GET /auth/zoho - Redirect to Zoho OAuth
router.get('/zoho', (req, res) => {
  if (isDemoMode()) {
    return res.redirect('/auth/demo');
  }
  const authUrl = getZohoAuthUrl();
  res.redirect(authUrl);
});

// GET /auth/callback - Zoho OAuth callback
router.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const { access_token, refresh_token, api_domain } = tokens;

    // Get organization info
    const encryptedRefreshToken = encrypt(refresh_token);

    // Try to find existing user or create new one
    let userId;
    try {
      const existingUser = await query('SELECT id FROM users WHERE zoho_org_id = $1', [process.env.ZOHO_ORG_ID || 'unknown']);
      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id;
        await query('UPDATE users SET refresh_token_encrypted = $1 WHERE id = $2', [encryptedRefreshToken, userId]);
      } else {
        const newUser = await query(
          'INSERT INTO users (id, zoho_org_id, refresh_token_encrypted) VALUES ($1, $2, $3) RETURNING id',
          [uuidv4(), process.env.ZOHO_ORG_ID || 'unknown', encryptedRefreshToken]
        );
        userId = newUser.rows[0].id;
      }
    } catch (dbErr) {
      console.warn('DB not available, using in-memory user');
      userId = uuidv4();
    }

    const jwtToken = generateToken({
      userId,
      zohoOrgId: process.env.ZOHO_ORG_ID || 'unknown',
      accessToken: access_token
    });

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${jwtToken}`);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth_error=callback_failed`);
  }
});

// GET /auth/status - Check authentication status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    let userInfo = { id: req.user.userId, isDemo: req.user.isDemo };
    
    try {
      const result = await query('SELECT id, zoho_org_id, preferences_json, created_at FROM users WHERE id = $1', [req.user.userId]);
      if (result.rows.length > 0) {
        userInfo = { ...userInfo, ...result.rows[0] };
      }
    } catch (_) {
      // DB not available
    }

    res.json({
      authenticated: true,
      user: userInfo
    });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
});

// POST /auth/logout - Clear session
router.post('/logout', authMiddleware, async (req, res) => {
  // JWT is stateless, but we can track logout in audit log
  try {
    await query(
      'INSERT INTO audit_log (id, user_id, query_text) VALUES ($1, $2, $3)',
      [uuidv4(), req.user.userId, 'USER_LOGOUT']
    );
  } catch (_) {
    // DB not available, that's OK
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
