'use client';

export default function ModuleOperators() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Operators and Two-Body Operators</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          From the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border space-y-4 text-sm text-journey-muted leading-relaxed">
        <p><strong className="text-journey-text">An operator</strong> is a mathematical rule that acts on a wave function to change it or to measure something (like energy).</p>
        <p><strong className="text-journey-text">A two-body operator</strong> is one that involves interactions between pairs of particles (for example, the repulsion between two electrons).</p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
          <p className="text-xs text-journey-primary leading-relaxed">In this algorithm, the reinforcement-learning agent chooses which two-body operators to apply at each step to gradually improve the wave function it is building.</p>
        </div>
      </div>
    </div>
  );
}
