'use client';

import { motion } from 'framer-motion';
import { MODULES } from '@/lib/quantum';

export default function Sidebar({ active, onSelect, collapsed, onToggle }: {
  active: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onToggle} />
      )}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen bg-quantum-card border-r border-gray-800/60
        transition-all duration-300 flex flex-col
        ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'w-64'}
      `}>
        <div className="flex items-center gap-3 p-4 border-b border-gray-800/60 shrink-0">
          <span className="text-xl font-bold text-quantum-cyan">&#9883;</span>
          {!collapsed && (
            <div>
              <span className="font-bold text-white text-sm">Quantum Lab</span>
              <p className="text-[10px] text-gray-600">interactive modules</p>
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
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
                  }
                `}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`
                    w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                    transition-all relative
                    ${isActive
                      ? 'bg-quantum-purple text-white shadow-lg shadow-purple-500/30'
                      : 'bg-gray-800 text-gray-500'
                    }
                  `}>
                    {i + 1}
                    <div className={`
                      absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full
                      ${isActive ? 'bg-quantum-cyan animate-pulse' : ''}
                    `} />
                  </div>
                  {i < MODULES.length - 1 && (
                    <div className={`
                      absolute left-[13px] top-7 w-0.5 h-[calc(100%+2px)] -z-10
                      ${i < MODULES.findIndex(x => x.id === active) ? 'bg-quantum-purple/40' : 'bg-gray-800'}
                    `} />
                  )}
                </div>
                {!collapsed && (
                  <div className="text-left leading-tight">
                    <div className="text-xs font-medium">{m.label}</div>
                    <div className="text-[10px] text-gray-600">{m.desc}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center p-3 border-t border-gray-800/60 text-gray-600 hover:text-gray-300 shrink-0"
        >
          <span className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>◀</span>
        </button>
      </aside>
    </>
  );
}
