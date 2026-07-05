'use client';

export default function ModuleWaveFunction() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Wave Function</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          From the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border space-y-4 text-sm text-journey-muted leading-relaxed">
        <p>The wave function is the mathematical object that encodes everything about a quantum system: where particles might be, their energies, etc.</p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
          <p className="text-xs text-journey-primary leading-relaxed">For a many-fermion system, the wave function is very high-dimensional and complicated, which is why this paper cares about <strong>&ldquo;compact&rdquo;</strong> ways to represent it.</p>
        </div>
      </div>
    </div>
  );
}
