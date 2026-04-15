# myFirst Omnichannel Commerce & CX Platform

Interactive demo prototype showcasing a unified omnichannel commerce and customer experience platform for **myFirst** — the World's First KidsTech Ecosystem.

Built for CEO review to validate the strategic vision: subscription-led, community-powered, AI-enhanced family tech ecosystem.

## Demo Screens

| Screen | Description |
|--------|-------------|
| **Home** | Personalized greeting, WHOOP-inspired stats bar, product carousel, membership CTA |
| **Shop** | Product catalog, subscription toggle (Buy Once vs Subscribe & Save), bundle builder, checkout |
| **Membership** | 4-tier Family Club, device registry, child profiles, benefits tracker, myFirst Moments |
| **AI Support** | Mochi AI companion powered by Claude, proactive care, smart escalation |
| **Find a Store** | Interactive map, store services, Discovery Session booking, Click & Collect |
| **Community** | Social feed, weekly challenges, badges, parent forum, events calendar |

## Quick Start

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

## Live AI Chat (Optional)

The demo works fully in **Demo Mode** with pre-crafted responses. To enable real Claude AI responses:

```bash
# Local development — start the proxy server
ANTHROPIC_API_KEY=your-key node server.js

# Vercel — add to Environment Variables
ANTHROPIC_API_KEY=your-key
```

## Deploy to Vercel

1. Import this repo in [Vercel](https://vercel.com)
2. It auto-detects the config from `vercel.json`
3. (Optional) Add `ANTHROPIC_API_KEY` in Settings > Environment Variables

## Tech Stack

- **React 18** + Vite
- **Tailwind CSS** — custom myFirst design system
- **Lucide React** — icons
- **Framer Motion** — animations
- **Claude API** (`claude-sonnet-4-20250514`) — AI chat

## Brand Design

- Primary Blue: `#0057FF`
- Coral CTA: `#FF6B35`
- Apple-inspired minimalism × myFirst playful energy
- Mobile-first responsive (works on phone, tablet, desktop)
