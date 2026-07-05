'use client';

export default function ModuleAnsatz() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-journey-text mb-3 tracking-tight">Ansatz (plural: ansätze)</h2>
        <p className="text-journey-muted text-sm leading-relaxed">
          From the paper <em className="text-journey-text">Reinforcement-Learning-Assisted Quantum Simulation of Many-Body Excited States and Real-Time Dynamics</em>.
        </p>
      </div>

      <div className="bg-journey-card rounded-xl p-6 border border-journey-border space-y-4 text-sm text-journey-muted leading-relaxed">
        <p>An ansatz is a chosen form or &ldquo;guess structure&rdquo; for the wave function or for the circuit that prepares it.</p>
        <p>You fix a general shape (for example, &ldquo;a sequence of unitary transformations with certain parameters&rdquo;) and then you optimize the parameters inside that shape.</p>
        <div className="bg-journey-surface rounded-lg p-4 border border-journey-primary/30">
          <p className="text-xs text-journey-primary leading-relaxed">The abstract talks about <strong>&ldquo;more compact ansätze&rdquo;</strong> and <strong>&ldquo;constant-scaling ansatz&rdquo;</strong>: they design a smart, efficient template for the wave function that does not blow up in size as the problem gets harder or time goes on.</p>
        </div>
      </div>
    </div>
  );
}
