import React, { useState, useRef, useEffect } from 'react';
import { Send, StopCircle } from 'lucide-react';

export default function InputBar({ onSubmit, isStreaming, onStop, placeholder }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSubmit(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-gray-50 border border-gray-300 rounded-2xl px-4 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={placeholder || 'Ask anything about your business...'}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none py-1.5 max-h-44"
            style={{ minHeight: '36px' }}
          />
          <div className="flex-shrink-0 pb-1">
            {isStreaming ? (
              <button
                onClick={onStop}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              >
                <StopCircle size={18} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
