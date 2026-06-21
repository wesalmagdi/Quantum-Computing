'use client';

import { motion } from 'framer-motion';

export default function BitVsQubitVisual({ bitValue, qubitBlend, onBitToggle, onBlendChange }:
  { bitValue: 0 | 1; qubitBlend: number; onBitToggle: () => void; onBlendChange: (v: number) => void }
) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl p-6 border border-journey-border">
        <h3 className="font-bold text-journey-text mb-4 tracking-wide">Classical Bit</h3>
        <div className="flex flex-col items-center gap-4">
          <svg width="80" height="140" viewBox="0 0 80 140" className="mb-2">
            <rect x="25" y="0" width="30" height="20" rx="3" fill="#333" />
            <rect x="35" y="20" width="10" height="30" fill="#444" />
            <motion.rect
              x="15" y="50" width="50" height="60" rx="8"
              fill="#222" stroke="#555" strokeWidth="2"
              animate={{ fill: bitValue === 0 ? '#1a3a3a' : '#3a1a2e' }}
            />
            <motion.circle
              cx="40" cy="80" r="14"
              animate={{
                cy: bitValue === 0 ? 65 : 95,
                fill: bitValue === 0 ? '#00d4ff' : '#ff00aa',
              }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <text x="40" y="128" textAnchor="middle" fill="#666" fontSize="12" fontFamily="monospace">
              {bitValue === 0 ? 'OFF = 0' : 'ON = 1'}
            </text>
          </svg>
          <button
            onClick={onBitToggle}
            className="px-5 py-2 rounded-lg text-sm font-bold bg-journey-surface text-journey-text hover:bg-journey-surface border border-journey-border transition-all"
          >
            Toggle ({bitValue})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-journey-border">
        <h3 className="font-bold text-journey-text mb-4 tracking-wide">Quantum Bit</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-24 h-24">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-journey-border"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-gray-600"
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: `conic-gradient(from 0deg, #00d4ff ${(1 - qubitBlend) * 100}%, #ff00aa ${(1 - qubitBlend) * 100}%)`,
              }}
              transition={{ type: 'spring', stiffness: 100 }}
            />
            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-mono text-journey-muted">
                {(qubitBlend * 100).toFixed(0)}% |1⟩
              </span>
            </div>
          </div>
          <input
            type="range"
            min={0} max={1} step={0.01}
            value={qubitBlend}
            onChange={(e) => onBlendChange(+e.target.value)}
            className="w-full max-w-[200px]"
          />
          <div className="flex justify-between w-full max-w-[200px] text-[10px] text-journey-muted">
            <span className="text-journey-primary/60">|0⟩</span>
            <span className="text-journey-muted">blend</span>
            <span className="text-journey-accent/60">|1⟩</span>
          </div>
        </div>
      </div>
    </div>
  );
}
