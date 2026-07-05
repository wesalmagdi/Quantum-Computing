'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ModuleIntro from '@/modules/ModuleIntro';
import ModuleQubit from '@/modules/ModuleQubit';
import ModuleSuperposition from '@/modules/ModuleSuperposition';
import ModuleMeasurement from '@/modules/ModuleMeasurement';
import ModuleEntanglement from '@/modules/ModuleEntanglement';
import ModuleHadamard from '@/modules/ModuleHadamard';
import ModulePauliX from '@/modules/ModulePauliX';
import ModuleInterference from '@/modules/ModuleInterference';
import ModuleSchrodinger from '@/modules/ModuleSchrodinger';
import ModuleExcitedStates from '@/modules/ModuleExcitedStates';
import ModuleManyFermion from '@/modules/ModuleManyFermion';
import ModuleWaveFunction from '@/modules/ModuleWaveFunction';
import ModuleOperators from '@/modules/ModuleOperators';
import ModuleAnsatz from '@/modules/ModuleAnsatz';
import ModuleUnitary from '@/modules/ModuleUnitary';
import ModuleBreak from '@/modules/ModuleBreak';
import { MODULES } from '@/lib/quantum';

const moduleComponents: Record<string, React.ReactNode> = {
  intro: <ModuleIntro />,
  qubit: <ModuleQubit />,
  superposition: <ModuleSuperposition />,
  measurement: <ModuleMeasurement />,
  entanglement: <ModuleEntanglement />,
  hadamard: <ModuleHadamard />,
  paulix: <ModulePauliX />,
  interference: <ModuleInterference />,
  schrodinger: <ModuleSchrodinger />,
  excitedstates: <ModuleExcitedStates />,
  manyfermion: <ModuleManyFermion />,
  wavefunction: <ModuleWaveFunction />,
  operators: <ModuleOperators />,
  ansatz: <ModuleAnsatz />,
  unitary: <ModuleUnitary />,
  break: <ModuleBreak />,
};

export default function StudyNotesView() {
  const [activeModule, setActiveModule] = useState('intro');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentModule = MODULES.find(m => m.id === activeModule) || MODULES[0];

  return (
    <div className="min-h-screen bg-journey-bg">
      <Sidebar
        active={activeModule}
        onSelect={setActiveModule}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header — Lab notebook bar */}
        <header className="sticky top-0 z-10 border-b border-journey-border/20 bg-journey-bg/90 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 -ml-1.5 text-journey-muted hover:text-journey-text"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-journey-primary/60">◇</span>
              <span className="text-xs font-mono font-medium text-journey-text">{currentModule.label}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-[9px] font-mono text-journey-muted/40">
                {String(MODULES.findIndex(m => m.id === activeModule) + 1).padStart(2, '0')}/{String(MODULES.length).padStart(2, '0')}
              </span>
              <div className="flex gap-0.5">
                {MODULES.map((m, i) => (
                  <div
                    key={m.id}
                    className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                      i <= MODULES.findIndex(mod => mod.id === activeModule)
                        ? 'bg-journey-primary/60'
                        : 'bg-journey-border/20'
                    }`}
                    onClick={() => setActiveModule(m.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Notebook content */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="border-l border-journey-border/10 pl-5 md:pl-8">
            {moduleComponents[activeModule] || <ModuleIntro />}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center border-t border-journey-border/10 py-4 mt-8">
          <div className="flex items-center justify-center gap-2 text-[9px] font-mono text-journey-muted/30">
            <span>◆</span>
            <span>Quantum Journal · Notebook Entry {String(MODULES.findIndex(m => m.id === activeModule) + 1).padStart(2, '0')}</span>
            <span>◆</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
