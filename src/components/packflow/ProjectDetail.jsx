import React, { useState } from 'react';
import { manufacturingSites, siteReadiness } from '../../data/packflowData';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specsheet', label: 'Production Spec Sheet' },
  { id: 'sitereadiness', label: 'Global Site Readiness' },
  { id: 'lifecycle', label: 'Lifecycle Timeline' },
];

const STATUS_CONFIG = {
  on_track: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  stalling: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  at_risk: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const STAGE_STATUS = {
  done: { color: 'bg-emerald-500', text: 'text-emerald-700', label: 'Completed' },
  in_progress: { color: 'bg-violet-500', text: 'text-violet-700', label: 'In Progress' },
  pending: { color: 'bg-slate-300', text: 'text-slate-500', label: 'Pending' },
};

const PIP_COLORS = {
  green: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  yellow: { dot: 'bg-amber-400', bg: 'bg-amber-50', text: 'text-amber-700' },
  red: { dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
};

const READINESS_LABELS = { dieTool: 'Die Tool', inkSet: 'Ink Set', boardGrade: 'Board Grade', machineCap: 'Machine Cap' };

export default function ProjectDetail({ project, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sampleRequested, setSampleRequested] = useState(false);
  const cfg = STATUS_CONFIG[project.status];

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 mb-3 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Projects
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {project.statusLabel}
              </span>
              <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">{project.phase}</span>
            </div>
            <div className="text-sm text-slate-500 mt-1">{project.client} · {project.product}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Due date</div>
            <div className="font-semibold text-slate-800">{project.dueDate}</div>
            <div className="text-xs text-slate-400 mt-1">Progress: {project.progress}%</div>
          </div>
        </div>

        {/* Alerts */}
        {project.alerts.length > 0 && (
          <div className="mt-3 space-y-2">
            {project.alerts.map((a, i) => (
              <div key={i} className={`flex items-start gap-2 text-sm rounded-lg px-3 py-2 ${
                a.type === 'danger' ? 'bg-red-50 text-red-800' :
                a.type === 'warning' ? 'bg-amber-50 text-amber-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                <span className="flex-shrink-0 mt-0.5">{a.type === 'danger' ? '🔴' : a.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <span>{a.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b -mb-4">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && <OverviewTab project={project} />}
        {activeTab === 'specsheet' && <SpecSheetTab project={project} />}
        {activeTab === 'sitereadiness' && <SiteReadinessTab project={project} />}
        {activeTab === 'lifecycle' && (
          <LifecycleTab
            project={project}
            sampleRequested={sampleRequested}
            onRequestSample={() => setSampleRequested(true)}
          />
        )}
      </div>
    </div>
  );
}

/* ── Overview Tab ── */
function OverviewTab({ project }) {
  const sustain = project.sustainability;
  const RECYCLE_COLOR = { A: 'bg-emerald-500', B: 'bg-lime-500', C: 'bg-yellow-500' };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        {/* Project details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Project Details</h2>
          <dl className="space-y-2.5">
            {[
              ['Client', project.client],
              ['Product', project.product],
              ['ECMA Code', project.ecmaCode],
              ['Board Grade', project.boardGrade],
              ['Mill', project.mill],
              ['Colour Spec', project.colors],
              ['Primary Site', project.primarySite],
            ].map(([label, val]) => (
              <div key={label} className="flex items-start gap-3">
                <dt className="text-xs text-slate-400 w-28 flex-shrink-0 pt-0.5">{label}</dt>
                <dd className="text-sm font-medium text-slate-800">{val}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Sustainability snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Sustainability Snapshot</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl ${RECYCLE_COLOR[sustain.recyclabilityGrade] || 'bg-slate-400'} flex items-center justify-center text-white font-bold text-2xl`}>
              {sustain.recyclabilityGrade}
            </div>
            <div>
              <div className="font-semibold text-slate-800">Recyclability Grade {sustain.recyclabilityGrade}</div>
              <div className="text-xs text-slate-400">CEFLEX / RecyClass standard</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ComplianceChip ok={sustain.plasticFree} label="Plastic-Free" />
            <ComplianceChip ok={sustain.eprCompliant} label="EU EPR" />
            <ComplianceChip ok={sustain.fscCertified} label="FSC" />
          </div>
          {!sustain.eprCompliant && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
              ⚠ EU EPR compliance not confirmed — board grade and finishing review required before EU market launch.
            </div>
          )}
        </div>
      </div>

      {/* Progress timeline summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-4">Progress Overview</h2>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all ${project.status === 'at_risk' ? 'bg-red-500' : project.status === 'stalling' ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-700 w-12 text-right">{project.progress}%</span>
        </div>
        <div className="flex gap-2 mt-4">
          {project.timeline.map((t, i) => {
            const s = STAGE_STATUS[t.status];
            return (
              <div key={i} className="flex-1 min-w-0">
                <div className={`h-1.5 rounded-full ${s.color} mb-1.5`} />
                <div className={`text-xs font-medium truncate ${s.text}`}>{t.stage}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Production Spec Sheet Tab ── */
function SpecSheetTab({ project }) {
  const totalBOM = project.bom.reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-5">
      {/* Header spec block */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Production Spec Sheet</h2>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PDF
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            ['Project Reference', project.id.toUpperCase()],
            ['Client', project.client],
            ['Product Description', project.product],
            ['Structural Code', project.ecmaCode],
            ['Board Grade & GSM', project.boardGrade],
            ['Substrate Mill', project.mill],
            ['Colour Specification', project.colors],
            ['Primary Production Site', project.primarySite],
            ['Target Launch Date', project.dueDate],
          ].map(([label, val]) => (
            <div key={label} className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-0.5">{label}</div>
              <div className="text-sm font-semibold text-slate-800">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bill of Materials */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Bill of Materials</h2>
          <span className="text-sm font-bold text-slate-700">Total: ${totalBOM.toLocaleString()}</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Item</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Specification</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Supplier</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Unit Cost</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody>
            {project.bom.map((row, i) => (
              <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-3 font-medium text-slate-800">{row.item}</td>
                <td className="px-5 py-3 text-slate-600">{row.spec}</td>
                <td className="px-5 py-3 text-slate-600">{row.supplier}</td>
                <td className="px-5 py-3 text-slate-600">{row.qty}</td>
                <td className="px-5 py-3 text-right text-slate-600">${row.unitCost}</td>
                <td className="px-5 py-3 text-right font-semibold text-slate-800">${row.total.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td colSpan="5" className="px-5 py-3 font-semibold text-slate-700 text-right">Total</td>
              <td className="px-5 py-3 text-right font-bold text-slate-900">${totalBOM.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Global Site Readiness Tab ── */
function SiteReadinessTab({ project }) {
  const readiness = siteReadiness[project.id] || {};
  const dimensions = Object.keys(READINESS_LABELS);

  function overallStatus(sitePips) {
    const vals = Object.values(sitePips);
    if (vals.includes('red')) return 'red';
    if (vals.includes('yellow')) return 'yellow';
    return 'green';
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-semibold text-slate-900">Global Site Readiness</h2>
        <p className="text-xs text-slate-400 mt-0.5">Production readiness across all 12 manufacturing sites for this project</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Ready</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-400" /> Needs review</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> Not ready</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Site</th>
              <th className="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Overall</th>
              {dimensions.map(d => (
                <th key={d} className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {READINESS_LABELS[d]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {manufacturingSites.map(site => {
              const pips = readiness[site.id] || {};
              const overall = overallStatus(pips);
              const oColor = PIP_COLORS[overall];
              return (
                <tr key={site.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{site.flag}</span>
                      <div>
                        <div className="font-medium text-slate-800">{site.name}</div>
                        <div className="text-xs text-slate-400">{site.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${oColor.bg} ${oColor.text}`}>
                      <span className={`w-2 h-2 rounded-full ${oColor.dot}`} />
                      {overall === 'green' ? 'Ready' : overall === 'yellow' ? 'Review' : 'Not Ready'}
                    </span>
                  </td>
                  {dimensions.map(d => {
                    const status = pips[d] || 'yellow';
                    const pc = PIP_COLORS[status];
                    return (
                      <td key={d} className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${pc.dot}`} title={READINESS_LABELS[d] + ': ' + status} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Lifecycle Timeline Tab ── */
function LifecycleTab({ project, sampleRequested, onRequestSample }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">Lifecycle Timeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">End-to-end NPD stages from brief to production launch</p>
        </div>
        {/* Request Physical Sample button */}
        {!sampleRequested ? (
          <button
            onClick={onRequestSample}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 shadow-sm transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            Request Physical Sample
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-semibold border border-emerald-200">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Sample Requested — ETA 5 business days
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-6">
            {project.timeline.map((stage, i) => {
              const s = STAGE_STATUS[stage.status];
              return (
                <div key={i} className="relative flex items-start gap-5">
                  {/* Dot */}
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stage.status === 'done' ? 'bg-emerald-100' :
                    stage.status === 'in_progress' ? 'bg-violet-100 ring-4 ring-violet-100' :
                    'bg-slate-100'
                  }`}>
                    {stage.status === 'done' ? (
                      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : stage.status === 'in_progress' ? (
                      <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-1 ${stage.status === 'in_progress' ? 'bg-violet-50 rounded-xl p-4 -ml-1 border border-violet-200' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-800">{stage.stage}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        stage.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                        stage.status === 'in_progress' ? 'bg-violet-100 text-violet-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400">{stage.date}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{stage.assignee}</span>
                    </div>

                    {/* In-progress note for stalling project */}
                    {stage.status === 'in_progress' && project.status === 'stalling' && (
                      <div className="mt-2 text-xs text-violet-700 bg-white rounded-lg px-3 py-2 border border-violet-100">
                        ⏳ Awaiting response — follow-up sent 3 days ago
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sample request history */}
      {sampleRequested && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">Sample Requests</h3>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold flex-shrink-0">AD</div>
            <div className="flex-1 bg-violet-50 rounded-xl px-4 py-3 border border-violet-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-800 text-sm">Physical Sample Requested</span>
                <span className="text-xs text-slate-400">Just now</span>
              </div>
              <div className="text-xs text-slate-600">
                Request sent to <strong>{project.primarySite}</strong> plant — 3 samples of <strong>{project.ecmaCode}</strong> on <strong>{project.boardGrade}</strong>. Estimated delivery: 5 business days.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComplianceChip({ ok, label }) {
  return (
    <div className={`rounded-lg px-3 py-2 text-center ${ok ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
      <div className={`text-lg ${ok ? 'text-emerald-600' : 'text-red-500'}`}>{ok ? '✓' : '✗'}</div>
      <div className={`text-xs font-medium ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{label}</div>
    </div>
  );
}
