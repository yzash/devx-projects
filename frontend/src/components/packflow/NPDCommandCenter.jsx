import React, { useState } from 'react';
import { manufacturingSites, npdFunnelData, projects } from '../../data/packflowData';

const STATUS_COLOR = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
  busy: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'At Capacity' },
  alert: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Alert' },
};

const REGION_ORDER = ['Asia', 'Africa', 'Europe', 'Europe / MENA', 'MENA'];

function groupByRegion(sites) {
  const grouped = {};
  for (const s of sites) {
    if (!grouped[s.region]) grouped[s.region] = [];
    grouped[s.region].push(s);
  }
  return grouped;
}

export default function NPDCommandCenter({ onSelectProject }) {
  const [hoveredPhase, setHoveredPhase] = useState(null);
  const totalNPD = npdFunnelData[0].count;
  const grouped = groupByRegion(manufacturingSites);

  const stalling = projects.filter(p => p.status === 'stalling' || p.status === 'at_risk');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">NPD Command Center</h1>
        <p className="text-slate-500 text-sm mt-0.5">Real-time view across your global NPD pipeline and manufacturing network</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4">
        <KPICard label="Active NPD Projects" value="50" sub="+6 this month" trend="up" color="violet" />
        <KPICard label="Press-Ready" value="3" sub="Ready to print" trend="up" color="emerald" />
        <KPICard label="Sites Operational" value="12" sub="Global footprint" trend="neutral" color="blue" />
        <KPICard label="Avg. NPD Cycle" value="94d" sub="-11d vs target" trend="up" color="amber" />
      </div>

      {/* Alerts */}
      {stalling.length > 0 && (
        <div className="space-y-2">
          {stalling.map(p =>
            p.alerts.map((a, i) => (
              <AlertBanner key={`${p.id}-${i}`} type={a.type} project={p} message={a.message} onSelect={() => onSelectProject(p)} />
            ))
          )}
        </div>
      )}

      <div className="grid grid-cols-5 gap-6">
        {/* NPD Velocity Funnel (spans 2 cols) */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">NPD Velocity Funnel</h2>
              <p className="text-xs text-slate-400 mt-0.5">{totalNPD} projects in pipeline</p>
            </div>
          </div>
          <div className="space-y-3">
            {npdFunnelData.map((phase, idx) => {
              const pct = Math.round((phase.count / totalNPD) * 100);
              const width = 100 - idx * 10;
              const isHover = hoveredPhase === phase.phase;
              return (
                <div
                  key={phase.phase}
                  className="cursor-default"
                  onMouseEnter={() => setHoveredPhase(phase.phase)}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600">{phase.phase}</span>
                    <span className="text-xs font-bold text-slate-800">{phase.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-8 bg-slate-100 rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md flex items-center pl-3 transition-all duration-300"
                        style={{
                          width: `${width}%`,
                          backgroundColor: isHover ? adjustColor(phase.color, -20) : phase.color,
                        }}
                      >
                        <span className="text-white text-xs font-semibold">{pct}%</span>
                      </div>
                    </div>
                  </div>
                  {idx < npdFunnelData.length - 1 && (
                    <div className="flex justify-center mt-1">
                      <svg className="w-3 h-3 text-slate-300" viewBox="0 0 10 6" fill="currentColor">
                        <path d="M0 0L5 6L10 0H0Z"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>
              <span>Avg. phase-to-phase transition: <strong className="text-slate-700">19 days</strong></span>
            </div>
          </div>
        </div>

        {/* Global manufacturing footprint (spans 3 cols) */}
        <div className="col-span-3 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-slate-900">Global Manufacturing Footprint</h2>
              <p className="text-xs text-slate-400 mt-0.5">12 sites · live utilisation</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/>&lt;80%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"/>80–90%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/>&gt;90%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {manufacturingSites.map(site => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </div>
      </div>

      {/* Region summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-4">Regional NPD Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(grouped).map(([region, sites]) => {
            const totalUtil = Math.round(sites.reduce((s, x) => s + x.utilization, 0) / sites.length);
            const totalNpdCount = sites.reduce((s, x) => s + x.npd, 0);
            return (
              <div key={region} className="bg-slate-50 rounded-lg p-4">
                <div className="font-medium text-slate-700 text-sm mb-2">{region}</div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{sites.length} sites</span>
                  <span>{totalNpdCount} NPD</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${totalUtil >= 90 ? 'bg-red-500' : totalUtil >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${totalUtil}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1 font-medium">{totalUtil}% avg utilisation</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SiteCard({ site }) {
  const st = STATUS_COLOR[site.status];
  const utilColor = site.utilization >= 90 ? 'bg-red-500' : site.utilization >= 80 ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className={`rounded-lg p-3 border ${site.status === 'alert' ? 'border-red-200 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-base leading-none">{site.flag}</span>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-800 truncate">{site.name}</div>
            <div className="text-xs text-slate-400">{site.country}</div>
          </div>
        </div>
        <span className={`flex-shrink-0 ml-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${st.bg} ${st.text}`}>{site.npd}</span>
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className={`h-1.5 rounded-full ${utilColor}`} style={{ width: `${site.utilization}%` }} />
        </div>
        <span className={`text-xs font-bold ${utilColor.replace('bg-', 'text-')}`}>{site.utilization}%</span>
      </div>
      {site.alert && (
        <div className="text-xs text-red-600 mt-1 flex items-start gap-1">
          <span className="mt-0.5 flex-shrink-0">⚠</span>
          <span className="leading-tight">{site.alert}</span>
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, sub, trend, color }) {
  const colors = {
    violet: { bg: 'bg-violet-50', val: 'text-violet-700', icon: 'text-violet-500' },
    emerald: { bg: 'bg-emerald-50', val: 'text-emerald-700', icon: 'text-emerald-500' },
    blue: { bg: 'bg-blue-50', val: 'text-blue-700', icon: 'text-blue-500' },
    amber: { bg: 'bg-amber-50', val: 'text-amber-700', icon: 'text-amber-500' },
  };
  const c = colors[color];
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="text-xs text-slate-500 font-medium mb-2">{label}</div>
      <div className={`text-2xl font-bold ${c.val}`}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

function AlertBanner({ type, project, message, onSelect }) {
  const styles = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const icons = {
    warning: '⚠️',
    danger: '🔴',
    info: 'ℹ️',
  };
  return (
    <div className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${styles[type]}`}>
      <div className="flex items-center gap-2 text-sm">
        <span>{icons[type]}</span>
        <span className="font-semibold">{project.name}:</span>
        <span>{message}</span>
      </div>
      <button
        onClick={onSelect}
        className="text-xs font-medium underline underline-offset-2 hover:opacity-70 flex-shrink-0 ml-3"
      >
        View Project →
      </button>
    </div>
  );
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
