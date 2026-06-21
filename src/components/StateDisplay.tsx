'use client';

import { getAmplitudes } from '@/lib/quantum';

export default function StateDisplay({ theta, phi }: { theta: number; phi: number }) {
  const { alpha, betaReal, betaImag } = getAmplitudes(theta, phi);

  const betaSign = betaReal >= 0 ? '+' : '-';
  const betaAbs = Math.abs(betaReal).toFixed(3);
  const imagSign = betaImag >= 0 ? '+' : '-';
  const imagAbs = Math.abs(betaImag).toFixed(3);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-journey-muted uppercase tracking-widest">State vector</h3>
      <div className="font-mono text-base bg-journey-surface rounded-lg p-3 text-center border border-journey-border">
        <span className="text-journey-muted">|ψ⟩ = </span>
        <span className="text-journey-primary">{alpha.toFixed(3)}</span>
        <span className="text-journey-muted"> |0⟩ </span>
        <span className="text-journey-muted">{betaSign} </span>
        <span className="text-journey-accent">{betaAbs}{imagSign}{imagAbs}i</span>
        <span className="text-journey-muted"> |1⟩</span>
      </div>
    </div>
  );
}
