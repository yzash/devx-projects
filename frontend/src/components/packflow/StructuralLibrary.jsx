import React, { useState } from 'react';
import { structuralTemplates } from '../../data/packflowData';

const CATEGORIES = ['All', 'STE', 'RTE', 'RSC', 'TTAB', 'CLB', 'SLV'];

const CATEGORY_COLORS = {
  STE: 'bg-violet-100 text-violet-700',
  RTE: 'bg-blue-100 text-blue-700',
  RSC: 'bg-amber-100 text-amber-700',
  TTAB: 'bg-emerald-100 text-emerald-700',
  CLB: 'bg-pink-100 text-pink-700',
  SLV: 'bg-cyan-100 text-cyan-700',
};

// Simple SVG thumbnails for each carton type
function CartonThumbnail({ type }) {
  const colors = {
    STE: '#6366f1', RTE: '#3b82f6', RSC: '#f59e0b',
    TTAB: '#10b981', CLB: '#ec4899', SLV: '#06b6d4',
  };
  const c = colors[type] || '#94a3b8';

  return (
    <div className="w-full h-28 flex items-center justify-center bg-slate-50 rounded-lg">
      <svg viewBox="0 0 80 80" width="72" height="72">
        {type === 'STE' && (
          <>
            <rect x="15" y="10" width="50" height="60" rx="2" fill="none" stroke={c} strokeWidth="2"/>
            <line x1="15" y1="20" x2="65" y2="20" stroke={c} strokeWidth="1.5" strokeDasharray="3,2"/>
            <line x1="15" y1="60" x2="65" y2="60" stroke={c} strokeWidth="1.5" strokeDasharray="3,2"/>
            <rect x="25" y="10" width="30" height="8" rx="1" fill={c} opacity="0.2"/>
            <rect x="25" y="62" width="30" height="8" rx="1" fill={c} opacity="0.2"/>
          </>
        )}
        {type === 'RTE' && (
          <>
            <rect x="15" y="10" width="50" height="60" rx="2" fill="none" stroke={c} strokeWidth="2"/>
            <line x1="15" y1="20" x2="65" y2="20" stroke={c} strokeWidth="1.5" strokeDasharray="3,2"/>
            <line x1="15" y1="60" x2="65" y2="60" stroke={c} strokeWidth="1.5" strokeDasharray="3,2"/>
            <rect x="25" y="10" width="30" height="8" rx="1" fill={c} opacity="0.2" transform="scale(-1,1) translate(-80,0)"/>
            <rect x="25" y="62" width="30" height="8" rx="1" fill={c} opacity="0.2"/>
          </>
        )}
        {type === 'RSC' && (
          <>
            <rect x="10" y="15" width="60" height="50" rx="2" fill="none" stroke={c} strokeWidth="2"/>
            <line x1="10" y1="15" x2="40" y2="5" stroke={c} strokeWidth="1.5"/>
            <line x1="70" y1="15" x2="40" y2="5" stroke={c} strokeWidth="1.5"/>
            <line x1="10" y1="65" x2="40" y2="75" stroke={c} strokeWidth="1.5"/>
            <line x1="70" y1="65" x2="40" y2="75" stroke={c} strokeWidth="1.5"/>
          </>
        )}
        {type === 'TTAB' && (
          <>
            <rect x="15" y="12" width="50" height="56" rx="2" fill="none" stroke={c} strokeWidth="2"/>
            <rect x="25" y="4" width="30" height="12" rx="2" fill={c} opacity="0.25"/>
            <path d="M20 68 L40 76 L60 68" fill={c} opacity="0.25" stroke={c} strokeWidth="1.5"/>
            <line x1="15" y1="20" x2="65" y2="20" stroke={c} strokeWidth="1" strokeDasharray="3,2"/>
          </>
        )}
        {type === 'CLB' && (
          <>
            <rect x="15" y="10" width="50" height="60" rx="2" fill="none" stroke={c} strokeWidth="2"/>
            <path d="M20 68 L40 78 L60 68 L60 62 L40 72 L20 62 Z" fill={c} opacity="0.3"/>
            <rect x="25" y="4" width="30" height="8" rx="1" fill={c} opacity="0.2"/>
          </>
        )}
        {type === 'SLV' && (
          <>
            <rect x="5" y="25" width="70" height="30" rx="2" fill="none" stroke={c} strokeWidth="2"/>
            <rect x="5" y="25" width="70" height="10" rx="2" fill={c} opacity="0.15"/>
            <line x1="5" y1="25" x2="75" y2="25" stroke={c} strokeWidth="1.5"/>
            <line x1="5" y1="55" x2="75" y2="55" stroke={c} strokeWidth="1.5"/>
          </>
        )}
      </svg>
    </div>
  );
}

export default function StructuralLibrary() {
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = structuralTemplates.filter(t => {
    const matchCat = activeCat === 'All' || t.category === activeCat;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Structural Library</h1>
        <p className="text-slate-500 text-sm mt-0.5">ECMA & FEFCO die-line templates with AI-powered similarity matching</p>
      </div>

      {/* AI insight bar */}
      <div className="mb-5 bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
        </div>
        <div className="text-sm text-violet-800">
          <strong>AI Insight:</strong> PackFlow detected 3 die-lines in your current projects with &gt;90% similarity to existing templates — estimated tooling saving of <strong>$12,400</strong> across active NPDs.
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search templates…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
        <div className="flex gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCat === cat
                  ? 'bg-violet-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(tmpl => (
          <TemplateCard
            key={tmpl.id}
            template={tmpl}
            isSelected={selected?.id === tmpl.id}
            onClick={() => setSelected(selected?.id === tmpl.id ? null : tmpl)}
          />
        ))}
      </div>

      {/* Detail drawer */}
      {selected && (
        <TemplateDetail template={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function TemplateCard({ template: t, isSelected, onClick }) {
  const catColor = CATEGORY_COLORS[t.category] || 'bg-slate-100 text-slate-600';
  const topMatch = t.aiMatches[0];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border cursor-pointer transition-all ${
        isSelected ? 'border-violet-400 ring-2 ring-violet-200' : 'border-slate-200 hover:border-violet-300 hover:shadow-sm'
      }`}
    >
      <div className="p-4">
        <CartonThumbnail type={t.category} />
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catColor}`}>{t.code}</span>
            <span className="text-xs text-slate-400">{t.substrate}</span>
          </div>
          <div className="font-semibold text-slate-800 text-sm mt-2">{t.name}</div>
          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{t.description}</div>
          <div className="text-xs text-slate-400 mt-1.5">{t.dimensions}</div>
        </div>
        {topMatch && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-xs text-violet-700 font-medium">{topMatch.score}% match to {topMatch.project}</span>
              </div>
              <span className="text-xs font-bold text-emerald-700">saves ${topMatch.saving.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateDetail({ template: t, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[t.category]}`}>{t.code}</span>
              <h2 className="font-bold text-slate-900">{t.name}</h2>
            </div>
            <div className="text-xs text-slate-400 mt-1">{t.dimensions} · {t.substrate}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 flex justify-center">
            <CartonThumbnail type={t.category} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t.description}</p>

          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">AI Similarity Matches</div>
            {t.aiMatches.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">
                    {m.score}%
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{m.project}</div>
                    <div className="text-xs text-slate-400">die-line similarity</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-700">${m.saving.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">tooling saving</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
              Use This Template
            </button>
            <button className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
              Download Die-line (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
