'use client';

import { motion } from 'framer-motion';

export default function QuantumDiceVisual({ p0, results, onRoll }: {
  p0: number;
  results: { zeros: number; ones: number } | null;
  onRoll: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-journey-border">
      <h3 className="font-bold text-journey-text mb-4 tracking-wide text-sm uppercase">The Quantum Die</h3>

      <div className="grid grid-cols-2 gap-6 items-center mb-4">
        <div className="flex flex-col items-center">
          <svg width="100" height="120" viewBox="0 0 100 120">
            <rect x="10" y="10" width="80" height="80" rx="10" fill="#1a1a2e" stroke="#555" strokeWidth="1.5" />
            <motion.rect
              x="10" y="10" width="80" height="80" rx="10"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="0"
              animate={{
                strokeWidth: 0,
              }}
            />
            <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="#333" strokeWidth="1" />

            <motion.rect
              x="20" y="20" width="30" height="60" rx="4"
              fill="#00d4ff" opacity={0.15}
              animate={{ height: `${p0 * 60}`, y: 20 + (1 - p0) * 60 }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
            <motion.rect
              x="55" y="20" width="30" height="60" rx="4"
              fill="#ff00aa" opacity={0.15}
              animate={{ height: `${(1 - p0) * 60}`, y: 20 + p0 * 60 }}
              transition={{ type: 'spring', stiffness: 100 }}
            />

            <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">
              |0⟩ or |1⟩
            </text>
            <text x="35" y="110" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="monospace">
              {(p0 * 100).toFixed(0)}%
            </text>
            <text x="70" y="110" textAnchor="middle" fill="#ff00aa" fontSize="10" fontFamily="monospace">
              {((1 - p0) * 100).toFixed(0)}%
            </text>
          </svg>
        </div>

        <div className="space-y-3">
          <div className="bg-journey-surface rounded-lg p-3 border border-journey-border">
            <div className="text-[10px] text-journey-muted mb-1">How it works</div>
            <p className="text-xs text-journey-muted leading-relaxed">
              A classical die has equal chance for each face. A quantum die is loaded — the probabilities
              are set by the amplitudes. Each roll is random, but the distribution matches the quantum
              prediction. The more you roll, the clearer the pattern becomes.
            </p>
          </div>

          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-[10px] text-journey-muted">
                <span>|0⟩: {results.zeros} rolls</span>
                <span>|1⟩: {results.ones} rolls</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-journey-surface relative">
                <motion.div
                  className="bg-journey-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.zeros / (results.zeros + results.ones)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="bg-journey-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(results.ones / (results.zeros + results.ones)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={{ left: `${p0 * 100}%` }} />
              </div>
              <div className="text-[10px] text-journey-muted text-right">
                expected (|) vs observed
              </div>
            </motion.div>
          )}

          <button
            onClick={onRoll}
            className="w-full py-2 rounded-lg text-sm font-medium bg-journey-primary text-white hover:bg-journey-primary-dark transition-colors"
          >
            Roll the quantum die
          </button>
        </div>
      </div>
    </div>
  );
}
