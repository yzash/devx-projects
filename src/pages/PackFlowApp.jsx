import React, { useState } from 'react';
import NPDCommandCenter from '../components/packflow/NPDCommandCenter';
import StructuralLibrary from '../components/packflow/StructuralLibrary';
import MaterialLab from '../components/packflow/MaterialLab';
import SustainabilitySection from '../components/packflow/SustainabilitySection';
import ProjectsList from '../components/packflow/ProjectsList';
import ProjectDetail from '../components/packflow/ProjectDetail';

const NAV = [
  { id: 'npd', label: 'NPD Command Center', icon: CommandCenterIcon },
  { id: 'structural', label: 'Structural Library', icon: StructuralIcon },
  { id: 'material', label: 'Material Lab', icon: MaterialIcon },
  { id: 'sustainability', label: 'Sustainability', icon: LeafIcon },
  { id: 'projects', label: 'Projects', icon: ProjectsIcon },
];

export default function PackFlowApp() {
  const [activeNav, setActiveNav] = useState('npd');
  const [selectedProject, setSelectedProject] = useState(null);

  function handleSelectProject(project) {
    setSelectedProject(project);
    setActiveNav('projects');
  }

  function renderContent() {
    if (activeNav === 'projects' && selectedProject) {
      return (
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      );
    }
    switch (activeNav) {
      case 'npd':
        return <NPDCommandCenter onSelectProject={handleSelectProject} />;
      case 'structural':
        return <StructuralLibrary />;
      case 'material':
        return <MaterialLab />;
      case 'sustainability':
        return <SustainabilitySection />;
      case 'projects':
        return <ProjectsList onSelectProject={handleSelectProject} />;
      default:
        return <NPDCommandCenter onSelectProject={handleSelectProject} />;
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
          <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BoxIcon />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">PackFlow AI</div>
            <div className="text-slate-400 text-xs">PLM Platform</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveNav(item.id); setSelectedProject(null); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon active={active} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AD
            </div>
            <div className="min-w-0">
              <div className="text-white text-xs font-medium truncate">Aditya Desai</div>
              <div className="text-slate-400 text-xs truncate">Global NPD Head</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

/* ── Icon components ── */
function BoxIcon() {
  return (
    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function CommandCenterIcon({ active }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}

function StructuralIcon({ active }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  );
}

function MaterialIcon({ active }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function LeafIcon({ active }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  );
}

function ProjectsIcon({ active }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-slate-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
