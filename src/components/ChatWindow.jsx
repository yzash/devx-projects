import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputBar from './InputBar';
import { Sparkles } from 'lucide-react';

const STARTER_QUESTIONS = [
  "What's our revenue this month compared to last month?",
  "Show me the current sales pipeline by stage",
  "How is our support team performing this month?",
  "What invoices are overdue?",
  "Which deals are most likely to close this quarter?",
];

export default function ChatWindow({ messages, onSubmit, isStreaming, onStop, onSaveQuery }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-12">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="text-indigo-600" size={28} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Ask me anything</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md">
              I can answer questions about your revenue, pipeline, support tickets, inventory, and more.
            </p>
            <div className="grid gap-2 w-full max-w-lg">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => onSubmit(q)}
                  className="text-left px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-sm text-gray-700 hover:text-indigo-700 transition-all shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-6">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onFollowUp={onSubmit}
                onSaveQuery={onSaveQuery}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <InputBar
        onSubmit={onSubmit}
        isStreaming={isStreaming}
        onStop={onStop}
      />
    </div>
  );
}
