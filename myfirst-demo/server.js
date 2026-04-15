import http from 'node:http';
import https from 'node:https';

const PORT = 3001;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set. Run: ANTHROPIC_API_KEY=your-key node server.js' }));
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { messages, system } = JSON.parse(body);

        const payload = JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          temperature: 0.7,
          system: system || '',
          messages: messages.map(m => ({ role: m.role, content: m.content })),
        });

        const options = {
          hostname: 'api.anthropic.com',
          path: '/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Length': Buffer.byteLength(payload),
          },
        };

        const apiReq = https.request(options, (apiRes) => {
          let data = '';
          apiRes.on('data', chunk => { data += chunk; });
          apiRes.on('end', () => {
            try {
              const response = JSON.parse(data);
              const content = response.content?.[0]?.text || 'Sorry, I could not process that request.';
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ content }));
            } catch {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to parse API response' }));
            }
          });
        });

        apiReq.on('error', (err) => {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        });

        apiReq.write(payload);
        apiReq.end();
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`myFirst API proxy running on http://localhost:${PORT}`);
  console.log('Proxying AI chat to Anthropic API (claude-sonnet-4-20250514)');
});
