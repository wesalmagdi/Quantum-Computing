'use client';

export default function ModuleExcitedStates() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">States of a Quantum System</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          From the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border space-y-4 text-sm text-journey-muted leading-relaxed">
        <p><strong className="text-journey-text">Ground state:</strong> the lowest-energy state of a system. Think of a ball in the lowest point of a bowl; it tends to sit there unless you add energy.</p>
        <p><strong className="text-journey-text">Excited state:</strong> any higher-energy state you get by adding energy (light, heat, etc.). The ball is pushed up the side of the bowl; it has more energy now.</p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
          <p className="text-xs text-journey-primary leading-relaxed">In the abstract, <strong>&ldquo;electronic excited states&rdquo;</strong> are higher-energy configurations of electrons in a molecule that are important for things like light absorption and chemical reactions.</p>
        </div>
      </div>
    </div>
  );
}
