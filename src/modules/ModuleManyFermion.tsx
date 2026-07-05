'use client';

export default function ModuleManyFermion() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Many-Fermion Systems</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          From the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border space-y-4 text-sm text-journey-muted leading-relaxed">
        <p><strong className="text-journey-text">Fermions:</strong> particles like electrons that obey the Pauli exclusion principle (no two can occupy exactly the same quantum state).</p>
        <p><strong className="text-journey-text">Many-fermion system:</strong> a system with many interacting fermions, such as all the electrons in a molecule or solid.</p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
          <p className="text-xs text-journey-primary leading-relaxed">So <strong>&ldquo;real-time quantum dynamics of many-fermion systems&rdquo;</strong> means tracking how a big collection of electrons moves and changes in time according to quantum mechanics.</p>
        </div>
      </div>
    </div>
  );
}
