import React, { useState } from 'react';
import { paperboardGrades } from '../../data/packflowData';

const GRADE_BG = { SBS: 'bg-blue-50 border-blue-200', FBB: 'bg-emerald-50 border-emerald-200', Kraft: 'bg-amber-50 border-amber-200', GC2: 'bg-slate-50 border-slate-200' };
const GRADE_BADGE = { SBS: 'bg-blue-100 text-blue-700', FBB: 'bg-emerald-100 text-emerald-700', Kraft: 'bg-amber-100 text-amber-700', GC2: 'bg-slate-100 text-slate-600' };
const RECYCLE_COLOR = { A: 'bg-emerald-500', B: 'bg-lime-500', C: 'bg-yellow-500', D: 'bg-orange-500', F: 'bg-red-500' };

export default function MaterialLab() {
  const [activeGrade, setActiveGrade] = useState(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Material Lab</h1>
        <p className="text-slate-500 text-sm mt-0.5">Approved paperboard grades, substrate mills, and GSM specifications</p>
      </div>

      {/* Summary banner */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Approved Grades</div>
          <div className="text-2xl font-bold text-slate-900">4</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">Certified Mills</div>
          <div className="text-2xl font-bold text-slate-900">5</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">FSC-Certified</div>
          <div className="text-2xl font-bold text-emerald-600">3 / 4</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs text-slate-500 mb-1">EU EPR Compliant</div>
          <div className="text-2xl font-bold text-emerald-600">3 / 4</div>
        </div>
      </div>

      {/* Grade cards */}
      <div className="grid grid-cols-2 gap-5">
        {paperboardGrades.map(grade => (
          <GradeCard
            key={grade.id}
            grade={grade}
            isExpanded={activeGrade === grade.id}
            onToggle={() => setActiveGrade(activeGrade === grade.id ? null : grade.id)}
          />
        ))}
      </div>

      {/* Mill comparison table */}
      <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Substrate Mill Comparison</h2>
          <p className="text-xs text-slate-400 mt-0.5">Approved partner mills for PackFlow projects</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Mill</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Origin</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Grades</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Certifications</th>
              </tr>
            </thead>
            <tbody>
              {buildMillRows(paperboardGrades).map((row, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="px-5 py-3 text-slate-600">{row.origin}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {row.grades.map(g => (
                        <span key={g} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${GRADE_BADGE[g] || 'bg-slate-100 text-slate-600'}`}>{g}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {row.certifications.map(c => (
                        <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">{c}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GradeCard({ grade, isExpanded, onToggle }) {
  const bg = GRADE_BG[grade.grade] || GRADE_BG.GC2;
  const badge = GRADE_BADGE[grade.grade] || GRADE_BADGE.GC2;
  const recycleBg = RECYCLE_COLOR[grade.recyclability] || 'bg-slate-400';

  return (
    <div className={`bg-white rounded-xl border-2 overflow-hidden ${bg.split(' ')[1]}`}>
      <div
        className={`p-5 cursor-pointer ${isExpanded ? '' : 'hover:bg-slate-50'}`}
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${badge}`}>{grade.grade}</span>
              <span className="text-xs text-slate-400">{grade.fullName}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">{grade.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            <div className={`w-7 h-7 rounded-full ${recycleBg} flex items-center justify-center`}>
              <span className="text-white text-xs font-bold">{grade.recyclability}</span>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3">
          {grade.plasticFree && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Plastic-Free</span>
          )}
          {grade.eprCompliant && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">EU EPR ✓</span>
          )}
          {!grade.eprCompliant && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">EU EPR Review Needed</span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100 mt-1 pt-4 space-y-4">
          {/* GSM range */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Available GSM</div>
            <div className="flex gap-2 flex-wrap">
              {grade.gsm.map(g => (
                <div key={g} className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">{g} gsm</div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Applications</div>
            <div className="flex gap-2 flex-wrap">
              {grade.applications.map(a => (
                <span key={a} className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>
          </div>

          {/* Mills */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Substrate Mills</div>
            <div className="space-y-2">
              {grade.mills.map(mill => (
                <div key={mill.name} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-800">{mill.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{mill.origin}</span>
                  </div>
                  <div className="flex gap-1">
                    {mill.certifications.map(c => (
                      <span key={c} className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildMillRows(grades) {
  const millMap = {};
  for (const grade of grades) {
    for (const mill of grade.mills) {
      if (!millMap[mill.name]) {
        millMap[mill.name] = { name: mill.name, origin: mill.origin, grades: [], certifications: mill.certifications };
      }
      if (!millMap[mill.name].grades.includes(grade.grade)) {
        millMap[mill.name].grades.push(grade.grade);
      }
    }
  }
  return Object.values(millMap);
}
