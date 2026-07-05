'use client';

export default function ModuleManyBody() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Many-Body Quantum Terminology</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          Key concepts from the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
          Physical concepts first, then quantum-computing ideas.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="text-lg font-bold text-journey-text mb-3">1. States of a quantum system</h3>
        <div className="space-y-4 text-sm text-journey-muted leading-relaxed">
          <p><strong className="text-journey-text">Ground state:</strong> the lowest-energy state of a system. Think of a ball in the lowest point of a bowl; it tends to sit there unless you add energy.</p>
          <p><strong className="text-journey-text">Excited state:</strong> any higher-energy state you get by adding energy (light, heat, etc.). The ball is pushed up the side of the bowl; it has more energy now.</p>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
            <p className="text-xs text-journey-primary leading-relaxed">In the abstract, <strong>&ldquo;electronic excited states&rdquo;</strong> are higher-energy configurations of electrons in a molecule that are important for things like light absorption and chemical reactions.</p>
          </div>
        </div>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="text-lg font-bold text-journey-text mb-3">2. Many-fermion systems</h3>
        <div className="space-y-4 text-sm text-journey-muted leading-relaxed">
          <p><strong className="text-journey-text">Fermions:</strong> particles like electrons that obey the Pauli exclusion principle (no two can occupy exactly the same quantum state).</p>
          <p><strong className="text-journey-text">Many-fermion system:</strong> a system with many interacting fermions, such as all the electrons in a molecule or solid.</p>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
            <p className="text-xs text-journey-primary leading-relaxed">So <strong>&ldquo;real-time quantum dynamics of many-fermion systems&rdquo;</strong> means tracking how a big collection of electrons moves and changes in time according to quantum mechanics.</p>
          </div>
        </div>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="text-lg font-bold text-journey-text mb-3">3. Wave function</h3>
        <div className="space-y-4 text-sm text-journey-muted leading-relaxed">
          <p>The wave function is the mathematical object that encodes everything about a quantum system: where particles might be, their energies, etc.</p>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
            <p className="text-xs text-journey-primary leading-relaxed">For a many-fermion system, the wave function is very high-dimensional and complicated, which is why this paper cares about <strong>&ldquo;compact&rdquo;</strong> ways to represent it.</p>
          </div>
        </div>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="text-lg font-bold text-journey-text mb-3">4. Operators and two-body operators</h3>
        <div className="space-y-4 text-sm text-journey-muted leading-relaxed">
          <p><strong className="text-journey-text">An operator</strong> is a mathematical rule that acts on a wave function to change it or to measure something (like energy).</p>
          <p><strong className="text-journey-text">A two-body operator</strong> is one that involves interactions between pairs of particles (for example, the repulsion between two electrons).</p>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
            <p className="text-xs text-journey-primary leading-relaxed">In this algorithm, the reinforcement-learning agent chooses which two-body operators to apply at each step to gradually improve the wave function it is building.</p>
          </div>
        </div>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="text-lg font-bold text-journey-text mb-3">5. Ansatz (plural: ansätze)</h3>
        <div className="space-y-4 text-sm text-journey-muted leading-relaxed">
          <p>An ansatz is a chosen form or &ldquo;guess structure&rdquo; for the wave function or for the circuit that prepares it.</p>
          <p>You fix a general shape (for example, &ldquo;a sequence of unitary transformations with certain parameters&rdquo;) and then you optimize the parameters inside that shape.</p>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
            <p className="text-xs text-journey-primary leading-relaxed">The abstract talks about <strong>&ldquo;more compact ansätze&rdquo;</strong> and <strong>&ldquo;constant-scaling ansatz&rdquo;</strong>: they design a smart, efficient template for the wave function that does not blow up in size as the problem gets harder or time goes on.</p>
          </div>
        </div>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border">
        <h3 className="text-lg font-bold text-journey-text mb-3">6. Unitary transformations</h3>
        <div className="space-y-4 text-sm text-journey-muted leading-relaxed">
          <p>A unitary transformation is a special kind of operation that preserves total probability; in quantum computing, each quantum gate is unitary.</p>
          <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
            <p className="text-xs text-journey-primary leading-relaxed">A <strong>&ldquo;sequence of unitary transformations&rdquo;</strong> is basically a quantum circuit applied to an initial reference state to produce the target wave function.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
