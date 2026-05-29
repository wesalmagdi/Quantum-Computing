'use client';

import { motion } from 'framer-motion';

export default function GloveAnalogyVisual({ showResult }: { showResult: boolean }) {
  return (
    <div className="bg-quantum-card rounded-xl p-6 border border-gray-800/60">
      <h3 className="font-bold text-white mb-4 tracking-wide text-sm uppercase">The Glove Analogy</h3>

      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-center">
          <motion.div
            className="w-20 h-24 mx-auto rounded-lg border-2 border-quantum-purple/40 bg-black/40 flex flex-col items-center justify-center gap-2"
            animate={showResult ? { borderColor: '#00d4ff' } : {}}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <rect x="8" y="4" width="20" height="28" rx="6" fill={showResult ? '#00d4ff' : '#555'} opacity={showResult ? 0.8 : 0.4} />
              <rect x="14" y="26" width="8" height="8" rx="2" fill={showResult ? '#00d4ff' : '#555'} opacity={showResult ? 0.8 : 0.4} />
              <text x="18" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                {showResult ? 'L' : '?'}
              </text>
            </svg>
            <span className="text-[10px] text-gray-500">New York box</span>
          </motion.div>
          {showResult && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] text-quantum-cyan mt-1 font-bold"
            >
              LEFT glove!
            </motion.div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-px h-8 bg-gray-700" />
          <motion.div
            animate={showResult ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: showResult ? 3 : 0, duration: 0.4 }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <line x1="5" y1="10" x2="35" y2="10" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="5" y1="20" x2="35" y2="20" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="5" y1="30" x2="35" y2="30" stroke="#7c3aed" strokeWidth="1" strokeDasharray="3 2" />
              <text x="20" y="16" textAnchor="middle" fill="#7c3aed" fontSize="7">shuffle</text>
              <text x="20" y="36" textAnchor="middle" fill="#7c3aed" fontSize="7">random</text>
            </svg>
          </motion.div>
          <span className="text-[10px] text-gray-600 mt-1">randomized</span>
          <div className="w-px h-8 bg-gray-700" />
        </div>

        <div className="text-center">
          <motion.div
            className="w-20 h-24 mx-auto rounded-lg border-2 border-quantum-purple/40 bg-black/40 flex flex-col items-center justify-center gap-2"
            animate={showResult ? { borderColor: '#ff00aa' } : {}}
          >
            <svg width="36" height="36" viewBox="0 0 36 36">
              <rect x="8" y="4" width="20" height="28" rx="6" fill={showResult ? '#ff00aa' : '#555'} opacity={showResult ? 0.8 : 0.4} />
              <rect x="14" y="26" width="8" height="8" rx="2" fill={showResult ? '#ff00aa' : '#555'} opacity={showResult ? 0.8 : 0.4} />
              <text x="18" y="20" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                {showResult ? 'R' : '?'}
              </text>
            </svg>
            <span className="text-[10px] text-gray-500">Tokyo box</span>
          </motion.div>
          {showResult && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-[10px] text-quantum-magenta mt-1 font-bold"
            >
              RIGHT glove!
            </motion.div>
          )}
        </div>
      </div>

      <div className="mt-4 bg-black/30 rounded-lg p-3 border border-gray-800/40">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong className="text-gray-300">Why entanglement is weirder:</strong> With gloves, each box always contained
          a specific glove from the start. With entangled qubits, neither qubit has a definite state until measured —
          they only exist as a shared "cloud" of possibilities. The measurement itself creates the outcome, and both
          qubits "agree" instantly across any distance. This was proven by <strong className="text-gray-300">Bell's theorem</strong> (1964),
          which showed no "hidden variables" can explain quantum correlations.
        </p>
      </div>
    </div>
  );
}
