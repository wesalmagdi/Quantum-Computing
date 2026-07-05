'use client';

export default function ModuleUnitary() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Unitary Transformations</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          From the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border space-y-4 text-sm text-journey-muted leading-relaxed">
        <p>A unitary transformation is a special kind of operation that preserves total probability; in quantum computing, each quantum gate is unitary.</p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
          <p className="text-xs text-journey-primary leading-relaxed">A <strong>&ldquo;sequence of unitary transformations&rdquo;</strong> is basically a quantum circuit applied to an initial reference state to produce the target wave function.</p>
        </div>
      </div>
    </div>
  );
}
