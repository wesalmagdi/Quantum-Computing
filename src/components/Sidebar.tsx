'use client';

const MODULES = [
  { id: 'intro', label: 'Introduction', desc: 'From bits to qubits', icon: '⚛️' },
  { id: 'qubit', label: 'Qubit', desc: 'The quantum bit', icon: '💎' },
  { id: 'superposition', label: 'Superposition', desc: 'Being two things at once', icon: '🌀' },
  { id: 'measurement', label: 'Measurement', desc: 'Collapse & statistics', icon: '📊' },
  { id: 'entanglement', label: 'Entanglement', desc: 'Spooky action', icon: '🔗' },
  { id: 'hadamard', label: 'Hadamard Gate', desc: 'Creating superposition', icon: '🚪' },
  { id: 'paulix', label: 'Pauli-X Gate', desc: 'Quantum NOT', icon: '🔄' },
  { id: 'interference', label: 'Interference', desc: 'Waves combining', icon: '🌊' },
  { id: 'schrodinger', label: "Schr\u00f6dinger Eq.", desc: 'Time evolution', icon: '📐' },
  { id: 'break', label: 'Break Time', desc: 'Take a break', icon: '🎮' },
];

const numGradients = [
  'from-indigo-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-violet-400 to-indigo-500',
  'from-lime-400 to-green-500',
  'from-fuchsia-400 to-purple-500',
  'from-sky-400 to-indigo-500',
  'from-orange-400 to-red-500',
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
          <span className="text-xl" style={{ color: '#818cf8' }}>⬡</span>
          {!collapsed && (
            <div>
              <span className="font-bold text-journey-text text-sm bg-gradient-to-r from-journey-primary to-journey-accent bg-clip-text text-transparent">Study Notes</span>
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
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative
                  ${isActive
                    ? 'text-white'
                    : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-journey-primary to-indigo-500 shadow-lg shadow-journey-primary/20" />
                )}
                <div className="flex items-center gap-3 shrink-0 relative z-10">
                  <div className={`
                    w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
                    transition-all relative
                    ${isActive
                      ? `bg-gradient-to-br ${numGradients[i]} text-white shadow-lg`
                      : 'bg-journey-surface'
                    }
                  `}>
                    <span className={isActive ? '' : 'text-journey-muted'}>{isActive ? m.icon : (i + 1)}</span>
                    <div className={`
                      absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full
                      ${isActive ? 'bg-white animate-pulse' : ''}
                    `} />
                  </div>
                  {i < MODULES.length - 1 && (
                    <div className={`
                      absolute left-[15px] top-8 w-0.5 h-[calc(100%+0px)] -z-10
                      ${i < MODULES.findIndex(x => x.id === active) ? 'bg-journey-primary/30' : 'bg-journey-border'}
                    `} />
                  )}
                </div>
                {!collapsed && (
                  <div className="text-left leading-tight relative z-10">
                    <div className="text-xs font-medium">{m.label}</div>
                    <div className={`text-[10px] ${isActive ? 'text-white/70' : 'text-journey-muted'}`}>{m.desc}</div>
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
