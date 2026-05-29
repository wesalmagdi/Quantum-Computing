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
};

export default function Home() {
  const [activeModule, setActiveModule] = useState('intro');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentModule = MODULES.find(m => m.id === activeModule) || MODULES[0];

  return (
    <div className="min-h-screen bg-quantum-bg">
      <Sidebar
        active={activeModule}
        onSelect={setActiveModule}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className="sticky top-0 z-10 bg-quantum-bg/80 backdrop-blur-md border-b border-gray-800/40">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg text-quantum-cyan">&#9883;</span>
              <span className="font-medium text-white">{currentModule.label}</span>
            </div>
            <span className="text-[10px] text-gray-600 ml-auto">
              {MODULES.findIndex(m => m.id === activeModule) + 1} / {MODULES.length}
            </span>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8">
          {moduleComponents[activeModule] || <ModuleIntro />}
        </main>

        <footer className="text-center text-xs text-gray-700 py-6 border-t border-gray-800/40 mt-12">
          Quantum Lab · Built with Next.js · Three.js · Framer Motion
        </footer>
      </div>
    </div>
  );
}
