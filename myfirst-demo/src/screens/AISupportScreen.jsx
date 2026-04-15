import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Phone, ArrowRight, ChevronDown, Bot, User, AlertCircle } from 'lucide-react';
import { family } from '../data/family';

const SYSTEM_PROMPT = `You are Mochi, the friendly AI companion for myFirst — the world's first KidsTech ecosystem. You help families with their myFirst devices. You are warm, knowledgeable, and speak clearly to both parents and children. You know about: Fone R2, Fone S4, Camera 50, CareBuds Max, 3dPen Make, myFirst Circle app, FreeSIM, Family Club membership tiers (Explorer free, Silver S$9.90/mo, Gold S$19.90/mo, Platinum S$39.90/mo). Keep responses concise and helpful. Always end with a helpful follow-up offer.

Current family context:
- Family: The Tan Family (Singapore)
- Parent: Sarah Tan
- Children: Liam (8) and Emma (11)
- Registered devices: Fone R2 (Liam), Camera 50 (Emma), CareBuds Max (Emma)
- Membership: Family Silver (S$9.90/month, renews in 23 days)
- CareBuds battery health: 78%`;

const QUICK_REPLIES = [
  { id: 1, text: "What's the difference between the Fone R2 and S4?", icon: '⌚' },
  { id: 2, text: "My son's watch won't connect to Circle", icon: '🔧' },
  { id: 3, text: "What does Family Gold include?", icon: '👑' },
];

const MOCK_RESPONSES = {
  "What's the difference between the Fone R2 and S4?": `Great question, Sarah! Here's a quick comparison for your family:

**myFirst Fone R2** (Liam's current watch)
• 1.3" TFT Touch Screen
• 4G Video Calls + GPS tracking
• IPX7 waterproof, 580mAh battery (~2 days)
• Price: S$249.90 or S$12.90/mo subscription

**myFirst Fone S4** (our newest model!)
• 1.4" AMOLED Display — brighter & sharper
• GPS + GLONASS for more precise tracking
• Heart Rate Monitor — great for active kids
• IP68 waterproof, 800mAh battery (~3 days)
• Music player built-in
• Price: S$329.90 or S$16.90/mo subscription

Since Liam is 8 and very active, the S4's heart rate monitor and longer battery life could be a great upgrade! Plus, with your Silver membership, you'd get 10% off.

Would you like me to help you compare upgrade options or check trade-in value for Liam's R2? 😊`,

  "My son's watch won't connect to Circle": `I'm sorry to hear Liam's Fone R2 is having connection issues! Let's fix that together. Here's a step-by-step guide:

**Quick Fix (try these first):**
1. On Liam's Fone R2 — restart the watch (hold power button for 5 seconds)
2. On your phone — make sure the myFirst Circle app is updated to the latest version
3. Check that Bluetooth is enabled on both devices

**If it still won't connect:**
4. In Circle app → Devices → Fone R2 → tap "Re-pair device"
5. On the watch, go to Settings → Connectivity → Reset connection
6. They should find each other within 30 seconds

**Still having trouble?**
This might be a network issue. Since Liam's Fone has FreeSIM active, make sure he's in an area with 4G coverage.

Most connection issues resolve with steps 1-3! Let me know how it goes, or I can connect you with a myFirst specialist who can help remotely. 🛠️`,

  "What does Family Gold include?": `Great timing to ask, Sarah! As a Silver member, here's what you'd unlock with **Family Gold** (S$19.90/month):

**Everything in Silver, plus:**
✅ Up to **6 devices** (you're using 3 of 3 on Silver)
✅ **20% member pricing** on all products (vs 10% now)
✅ **Quarterly accessory gift** worth S$40 — that's S$160/year in free accessories!
✅ **Dedicated AI Coach** — I'd become even more helpful with personalised insights
✅ **In-store VIP access** — priority service at Suntec City store
✅ **Advanced usage insights** — detailed reports on the kids' device activity

**Your savings at a glance:**
• Current Silver savings this quarter: S$42.50
• Estimated Gold savings: S$95+ per quarter
• That's just S$10 more per month for 2x the value!

Since your family has 3 devices and the kids are growing, Gold is perfect for families like yours. Want me to walk you through the upgrade process? It takes just 30 seconds! 👑`,
};

const PROACTIVE_MESSAGES = [
  {
    type: 'care',
    text: "💡 I noticed Emma's CareBuds battery health is at 78%. Here are some tips to optimise it:\n\n1. Avoid charging past 100% overnight\n2. Use the charging case — it's gentler on battery\n3. Keep firmware updated for battery optimisations\n\nWould you like me to schedule a battery check at the Suntec City store?",
  },
  {
    type: 'milestone',
    text: "🎉 Amazing news! Emma just took her 1,000th photo with Camera 50! She's officially a myFirst Photo Champ!\n\nHer favourite subjects this month: nature (42%), family (28%), pets (18%), art (12%).\n\nWant to feature her best shots in the Community gallery? She might inspire other young photographers!",
  },
];

export default function AISupportScreen() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi there, Sarah! 👋 I'm Mochi, your myFirst AI companion.\n\nI can see you have a **Fone R2** (Liam's) and **Camera 50 + CareBuds Max** (Emma's) registered. Your Family Silver membership renews in 23 days.\n\nHow can I help the Tan family today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const [proactiveShown, setProactiveShown] = useState(false);
  const [apiMode, setApiMode] = useState('mock'); // 'mock' | 'live'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Show proactive message after first interaction
  useEffect(() => {
    if (messages.length === 3 && !proactiveShown) {
      setProactiveShown(true);
      const timer = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            id: `proactive-${Date.now()}`,
            role: 'assistant',
            content: PROACTIVE_MESSAGES[0].text,
            timestamp: new Date(),
            isProactive: true,
          }]);
        }, 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages.length, proactiveShown]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: `user-${Date.now()}`, role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (apiMode === 'live') {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].filter(m => m.role !== 'system').map(m => ({
              role: m.role,
              content: m.content,
            })),
            system: SYSTEM_PROMPT,
          }),
        });
        const data = await res.json();
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.content || data.error || 'Sorry, I encountered an issue. Let me connect you with a specialist.',
          timestamp: new Date(),
        }]);
      } catch {
        setIsTyping(false);
        // Fallback to mock
        deliverMockResponse(text);
      }
    } else {
      // Mock response with realistic delay
      setTimeout(() => {
        deliverMockResponse(text);
      }, 1500 + Math.random() * 1000);
    }
  };

  const deliverMockResponse = (text) => {
    setIsTyping(false);
    const mockKey = Object.keys(MOCK_RESPONSES).find(k =>
      text.toLowerCase().includes(k.toLowerCase().slice(0, 20)) || k.toLowerCase().includes(text.toLowerCase().slice(0, 20))
    );

    const response = mockKey
      ? MOCK_RESPONSES[mockKey]
      : `Thanks for your question, Sarah! That's a great topic. Let me look into that for you.\n\nBased on what I know about your family's setup (Fone R2 for Liam, Camera 50 and CareBuds Max for Emma), I'd recommend checking the myFirst Circle app for the latest updates and settings.\n\nWould you like me to:\n• Provide more specific guidance on this topic?\n• Connect you with a myFirst specialist?\n• Check if there are any relevant community posts about this?\n\nI'm here to help! 😊`;

    setMessages(prev => [...prev, {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }]);
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply.text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white border-b border-gray-50 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full mf-gradient-hero flex items-center justify-center relative">
            <span className="text-lg">🤖</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-mf-dark">Mochi — myFirst AI</h2>
            <p className="text-xs text-green-500 font-medium">Online · Avg. response: instant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setApiMode(apiMode === 'mock' ? 'live' : 'mock')}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
              apiMode === 'live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {apiMode === 'live' ? '● Live AI' : '○ Demo Mode'}
          </button>
          <button
            onClick={() => setShowEscalation(true)}
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
          >
            <Phone size={16} className="text-mf-gray" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[85%] lg:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full mf-gradient-hero flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs">🤖</span>
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-mf-blue text-white rounded-br-md'
                  : msg.isProactive
                    ? 'bg-amber-50 border border-amber-100 text-mf-dark rounded-bl-md'
                    : 'bg-white border border-gray-100 text-mf-dark shadow-sm rounded-bl-md'
              }`}>
                {msg.isProactive && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} className="text-amber-500" />
                    <span className="text-[10px] font-semibold text-amber-600 uppercase">Proactive Care</span>
                  </div>
                )}
                <div className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : 'text-mf-dark'}`}>
                  {msg.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i}>{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                  })}
                </div>
                <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 items-end">
              <div className="w-7 h-7 rounded-full mf-gradient-hero flex items-center justify-center flex-shrink-0">
                <span className="text-xs">🤖</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-mf-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-mf-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-mf-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex-shrink-0">
          <p className="text-xs text-mf-gray font-medium mb-2">Suggested questions:</p>
          <div className="flex flex-col gap-2">
            {QUICK_REPLIES.map(reply => (
              <button
                key={reply.id}
                onClick={() => handleQuickReply(reply)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-100 bg-white text-left text-sm text-mf-dark hover:border-mf-blue hover:bg-mf-blue-50 transition-all active:scale-[0.99]"
              >
                <span>{reply.icon}</span>
                <span className="font-medium">{reply.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-50 bg-white px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(input); }}
            placeholder="Ask Mochi anything..."
            className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm text-mf-dark placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-mf-blue/20 transition-all"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isTyping
                ? 'bg-mf-blue text-white active:scale-95'
                : 'bg-gray-100 text-gray-300'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Escalation Modal */}
      {showEscalation && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEscalation(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-3xl lg:rounded-3xl animate-slide-up p-5">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-mf-blue-light flex items-center justify-center mx-auto mb-3">
                <Phone size={24} className="text-mf-blue" />
              </div>
              <h2 className="text-xl font-bold text-mf-dark">Connect with a Specialist</h2>
              <p className="text-sm text-mf-gray mt-1">A myFirst specialist can help with complex issues</p>
            </div>
            <div className="space-y-3 mb-5">
              <div className="mf-card p-3 flex items-center gap-3 border border-mf-blue/10">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <div>
                  <p className="text-sm font-semibold text-mf-dark">Available now</p>
                  <p className="text-xs text-mf-gray">Estimated wait: 2 minutes</p>
                </div>
              </div>
              <div className="bg-mf-blue-50 rounded-xl p-3">
                <p className="text-xs text-mf-blue font-medium mb-1">📋 Conversation summary will be shared</p>
                <p className="text-xs text-mf-gray">Your specialist will have full context from this chat — no need to repeat yourself.</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="mf-btn-secondary w-full text-center">
                <Phone size={16} className="inline mr-2" /> Call Now
              </button>
              <button className="mf-btn-outline w-full text-center">
                Email Follow-up
              </button>
              <button className="w-full py-2.5 text-sm text-mf-gray font-medium" onClick={() => setShowEscalation(false)}>
                Continue with Mochi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
