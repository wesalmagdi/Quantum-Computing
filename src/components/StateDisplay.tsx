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
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">State vector</h3>
      <div className="font-mono text-base bg-black/30 rounded-lg p-3 text-center border border-gray-800/50">
        <span className="text-gray-500">|ψ⟩ = </span>
        <span className="text-quantum-cyan">{alpha.toFixed(3)}</span>
        <span className="text-gray-400"> |0⟩ </span>
        <span className="text-gray-500">{betaSign} </span>
        <span className="text-quantum-magenta">{betaAbs}{imagSign}{imagAbs}i</span>
        <span className="text-gray-400"> |1⟩</span>
      </div>
    </div>
  );
}
