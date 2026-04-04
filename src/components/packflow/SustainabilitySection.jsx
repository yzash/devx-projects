import React from 'react';
import { projects, sustainabilityData } from '../../data/packflowData';

const GRADE_CONFIG = {
  A: { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Excellent' },
  B: { color: 'bg-lime-500', text: 'text-lime-700', bg: 'bg-lime-100', label: 'Good' },
  C: { color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-100', label: 'Fair' },
  D: { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-100', label: 'Poor' },
  F: { color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-100', label: 'Fail' },
};

export default function SustainabilitySection() {
  const enriched = sustainabilityData.map(d => ({
    ...d,
    project: projects.find(p => p.id === d.projectId),
  }));

  const gradeA = enriched.filter(d => d.recyclabilityGrade === 'A').length;
  const plasticFreeCount = enriched.filter(d => d.plasticFree).length;
  const eprCompliant = enriched.filter(d => d.eprCompliant).length;
  const fscCount = enriched.filter(d => d.fscCertified).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Sustainability</h1>
        <p className="text-slate-500 text-sm mt-0.5">Recyclability grades, plastic-free status, and EU EPR compliance across active projects</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Recyclability A-Grade</div>
          <div className="text-2xl font-bold text-emerald-600">{gradeA} / {enriched.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">projects</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Plastic-Free</div>
          <div className="text-2xl font-bold text-emerald-600">{plasticFreeCount} / {enriched.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">projects</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">EU EPR Compliant</div>
          <div className="text-2xl font-bold text-emerald-600">{eprCompliant} / {enriched.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">projects</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">FSC Certified</div>
          <div className="text-2xl font-bold text-emerald-600">{fscCount} / {enriched.length}</div>
          <div className="text-xs text-slate-400 mt-0.5">projects</div>
        </div>
      </div>

      {/* EPR notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 mb-6 flex items-start gap-3">
        <div className="text-amber-600 text-lg mt-0.5 flex-shrink-0">⚠️</div>
        <div>
          <div className="font-semibold text-amber-800 text-sm">EU EPR Action Required</div>
          <div className="text-amber-700 text-xs mt-0.5">1 project (Luxury Cosmetics Carton) is not yet EU Extended Producer Responsibility compliant. GC2 board with hot foil and matte lam must be reviewed before the product enters the EU market.</div>
        </div>
      </div>

      {/* Project sustainability cards */}
      <div className="space-y-4">
        {enriched.map(d => d.project && (
          <SustainabilityCard key={d.projectId} data={d} />
        ))}
      </div>

      {/* Recyclability grade legend */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-900 mb-3">Recyclability Grade System</h2>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(GRADE_CONFIG).map(([grade, cfg]) => (
            <div key={grade} className={`rounded-lg p-3 ${cfg.bg} text-center`}>
              <div className={`text-2xl font-bold ${cfg.text} mb-1`}>{grade}</div>
              <div className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Grades are assigned based on CEFLEX / RecyClass assessment — considering substrate fibre content, inks, coatings, adhesives, and finishing treatments.
        </p>
      </div>
    </div>
  );
}

function SustainabilityCard({ data }) {
  const { project, recyclabilityGrade, plasticFree, eprCompliant, fscCertified, carbonFootprint, notes } = data;
  const cfg = GRADE_CONFIG[recyclabilityGrade] || GRADE_CONFIG.F;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-10 h-10 rounded-xl ${cfg.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
              {recyclabilityGrade}
            </div>
            <div>
              <div className="font-semibold text-slate-900">{project.name}</div>
              <div className="text-xs text-slate-400">{project.client} · {project.boardGrade} · {project.mill}</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 ml-13 pl-0.5">{notes}</p>
        </div>

        <div className="flex flex-col gap-2 items-end ml-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FlagBadge ok={plasticFree} label="Plastic-Free" />
            <FlagBadge ok={eprCompliant} label="EU EPR" />
            <FlagBadge ok={fscCertified} label="FSC" />
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Carbon footprint</div>
            <div className="text-sm font-bold text-slate-700">{carbonFootprint} kg CO₂e / 1,000 units</div>
          </div>
        </div>
      </div>

      {/* Compliance bar */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <ComplianceBar label="Recyclability" value={recyclabilityGrade === 'A' ? 100 : recyclabilityGrade === 'B' ? 80 : recyclabilityGrade === 'C' ? 60 : 30} color={cfg.color} />
        <ComplianceBar label="Plastic-Free Score" value={plasticFree ? 100 : 20} color={plasticFree ? 'bg-emerald-500' : 'bg-red-400'} />
        <ComplianceBar label="EPR Readiness" value={eprCompliant ? 100 : 30} color={eprCompliant ? 'bg-emerald-500' : 'bg-amber-500'} />
      </div>
    </div>
  );
}

function FlagBadge({ ok, label }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
      {ok ? '✓' : '✗'} {label}
    </span>
  );
}

function ComplianceBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
