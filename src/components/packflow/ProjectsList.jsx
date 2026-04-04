import React from 'react';
import { projects } from '../../data/packflowData';

const STATUS_CONFIG = {
  on_track: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  stalling: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  at_risk: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const PHASE_ORDER = ['Structural Design', 'Sampling', 'Customer Approval', 'Press-Ready'];

export default function ProjectsList({ onSelectProject }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm mt-0.5">{projects.length} active NPD projects</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      </div>

      {/* Phase pipeline */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {PHASE_ORDER.map(phase => {
          const phaseProjects = projects.filter(p => p.phase === phase);
          return (
            <div key={phase} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{phase}</div>
              <div className="text-2xl font-bold text-slate-900 mb-2">{phaseProjects.length}</div>
              <div className="space-y-1.5">
                {phaseProjects.map(p => {
                  const cfg = STATUS_CONFIG[p.status];
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="w-full text-left text-xs flex items-center gap-1.5 hover:text-violet-700 transition-colors group"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                      <span className="truncate text-slate-600 group-hover:text-violet-700">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {projects.map(project => (
          <ProjectRow key={project.id} project={project} onClick={() => onSelectProject(project)} />
        ))}
      </div>
    </div>
  );
}

function ProjectRow({ project, onClick }) {
  const cfg = STATUS_CONFIG[project.status];
  const isHero = project.id === 'p1';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border cursor-pointer transition-all hover:shadow-sm hover:border-violet-300 ${
        isHero ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isHero && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">⭐ Hero Project</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {project.statusLabel}
              </span>
              <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-100">{project.phase}</span>
            </div>
            <h3 className="font-semibold text-slate-900 text-base">{project.name}</h3>
            <div className="text-xs text-slate-500 mt-0.5">{project.client} · {project.product}</div>
          </div>
          <div className="text-right ml-4 flex-shrink-0">
            <div className="text-xs text-slate-400">Due</div>
            <div className="text-sm font-medium text-slate-700">{project.dueDate}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${project.status === 'at_risk' ? 'bg-red-500' : project.status === 'stalling' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-shrink-0">
            <span title="Board grade">{project.boardGrade}</span>
            <span title="ECMA code">{project.ecmaCode}</span>
            <span title="Primary site" className="flex items-center gap-1">
              <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {project.primarySite}
            </span>
          </div>
        </div>

        {project.alerts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.alerts.map((a, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-lg ${
                a.type === 'danger' ? 'bg-red-50 text-red-700' :
                a.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                'bg-blue-50 text-blue-700'
              }`}>
                {a.type === 'danger' ? '🔴' : a.type === 'warning' ? '⚠️' : 'ℹ️'} {a.message}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
