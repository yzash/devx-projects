import React from 'react';
import { Sparkles } from 'lucide-react';

export default function FollowUpChips({ followUps = [], onSelect }) {
  if (!followUps || followUps.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {followUps.map((q, i) => (
        <button
          key={i}
          onClick={() => onSelect(q)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 border border-gray-200 hover:border-indigo-200 transition-all duration-150 text-left"
        >
          <Sparkles size={13} className="flex-shrink-0 opacity-70" />
          <span>{q}</span>
        </button>
      ))}
    </div>
  );
}
