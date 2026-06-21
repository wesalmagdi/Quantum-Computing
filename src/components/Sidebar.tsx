'use client';

import { motion } from 'framer-motion';

// Inline module definitions to avoid dependency on the old quantum.ts
const MODULES = [
  { id: 'intro', label: 'Introduction', desc: 'From bits to qubits' },
  { id: 'qubit', label: 'Qubit', desc: 'The quantum bit' },
  { id: 'superposition', label: 'Superposition', desc: 'Being two things at once' },
  { id: 'measurement', label: 'Measurement', desc: 'Collapse & statistics' },
  { id: 'entanglement', label: 'Entanglement', desc: 'Spooky action' },
  { id: 'hadamard', label: 'Hadamard Gate', desc: 'Creating superposition' },
  { id: 'paulix', label: 'Pauli-X Gate', desc: 'Quantum NOT' },
  { id: 'interference', label: 'Interference', desc: 'Waves combining' },
  { id: 'schrodinger', label: "Schr\u00f6dinger Eq.", desc: 'Time evolution' },
  { id: 'break', label: 'Break Time', desc: 'Take a break — climb Icy Tower' },
];

export default function Sidebar({ active, onSelect, collapsed, onToggle }: {
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/20 z-20 lg:hidden" onClick={onToggle} />
      )}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen bg-journey-card border-r border-journey-border
        transition-all duration-300 flex flex-col
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'}
      `}>
        <div className="flex items-center gap-3 p-4 border-b border-journey-border shrink-0">
          <span className="text-xl font-bold text-journey-primary">{'\u25C8'}</span>
          {!collapsed && (
            <div>
              <span className="font-bold text-journey-text text-sm">Study Notes</span>
              <p className="text-[10px] text-journey-muted">quantum modules</p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {MODULES.map((m, i) => {
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { onSelect(m.id); if (window.innerWidth < 1024) onToggle(); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative
                  ${isActive
                    ? 'text-journey-text'
                    : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface'
                  }
                `}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all relative
                    ${isActive
                      ? 'bg-journey-primary text-white shadow-lg shadow-indigo-200'
                      : 'bg-journey-surface text-journey-muted'
                    }
                  `}>
                    {i + 1}
                    <div className={`
                      absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full
                      ${isActive ? 'bg-journey-accent animate-pulse' : ''}
                    `} />
                  </div>
                  {i < MODULES.length - 1 && (
                    <div className={`
                      absolute left-[13px] top-7 w-0.5 h-[calc(100%+2px)] -z-10
                      ${i < MODULES.findIndex(x => x.id === active) ? 'bg-journey-primary/30' : 'bg-journey-border'}
                    `} />
                  )}
                </div>
                {!collapsed && (
                  <div className="text-left leading-tight">
                    <div className="text-xs font-medium">{m.label}</div>
                    <div className="text-[10px] text-journey-muted">{m.desc}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center p-3 border-t border-journey-border text-journey-muted hover:text-journey-text shrink-0"
        >
          <span className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>{'\u25C0'}</span>
        </button>
      </aside>
    </>
  );
}
