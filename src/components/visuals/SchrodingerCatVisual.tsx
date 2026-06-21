'use client';

import { motion } from 'framer-motion';

export default function SchrodingerCatVisual({ showStory }: { showStory: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={showStory ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-amber-900/10 rounded-xl p-6 border border-amber-800/20 space-y-6">
        <h3 className="font-bold text-amber-200/80 tracking-wide text-sm uppercase">Schrodinger's Cat — The Experiment</h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-1 bg-journey-surface rounded-lg p-4 border border-journey-accent/20 text-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-2">
              <ellipse cx="40" cy="45" rx="25" ry="20" fill="#444" />
              <circle cx="40" cy="30" r="14" fill="#555" />
              <path d="M28 30 Q30 20 35 18" stroke="#666" strokeWidth="1" fill="none" />
              <path d="M52 30 Q50 20 45 18" stroke="#666" strokeWidth="1" fill="none" />
              <circle cx="35" cy="28" r="2" fill="#ffcc00" />
              <circle cx="45" cy="28" r="2" fill="#ffcc00" />
              <path d="M36 38 Q40 44 44 38" stroke="#888" strokeWidth="1.5" fill="none" />
              <rect x="30" y="55" width="20" height="8" rx="4" fill="#666" />
              <path d="M15 65 Q20 75 30 70" stroke="#555" strokeWidth="2" fill="none" />
              <path d="M65 65 Q60 75 50 70" stroke="#555" strokeWidth="2" fill="none" />
            </svg>
            <div className="text-xs text-gray-500 font-medium mt-1">Step 1</div>
            <div className="text-[10px] text-gray-600 leading-relaxed mt-1">
              A cat is placed in a sealed steel box with radioactive material, a Geiger counter, and poison.
            </div>
          </div>

          <div className="md:col-span-1 bg-journey-surface rounded-lg p-4 border border-journey-accent/20 text-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-2">
              <circle cx="40" cy="40" r="18" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="4 3" />
              <text x="40" y="44" textAnchor="middle" fill="#888" fontSize="22" fontFamily="serif">?</text>
              <motion.circle
                cx="40" cy="40" r="18"
                fill="none" stroke="#7c3aed" strokeWidth="1.5"
                animate={{ rotate: 360 }}
                style={{ originX: '40px', originY: '40px' }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              />
            </svg>
            <div className="text-xs text-gray-500 font-medium mt-1">Step 2</div>
            <div className="text-[10px] text-gray-600 leading-relaxed mt-1">
              Radioactive atom has 50% chance to decay in one hour. If it decays, poison is released.
            </div>
          </div>

          <div className="md:col-span-1 bg-journey-surface rounded-lg p-4 border border-journey-accent/20 text-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-2">
              <ellipse cx="40" cy="45" rx="25" ry="20" fill="#3a2a2a" />
              <circle cx="40" cy="30" r="14" fill="#4a3a3a" />
              <path d="M28 30 Q30 20 35 18" stroke="#5a4a4a" strokeWidth="1" fill="none" />
              <path d="M52 30 Q50 20 45 18" stroke="#5a4a4a" strokeWidth="1" fill="none" />
              <circle cx="35" cy="28" r="2" fill="#442200" />
              <circle cx="45" cy="28" r="2" fill="#442200" />
              <path d="M36 38 Q40 44 44 38" stroke="#5a4a4a" strokeWidth="1.5" fill="none" />
              <rect x="30" y="55" width="20" height="8" rx="4" fill="#555" />
              <text x="40" y="44" textAnchor="middle" fill="#884400" fontSize="10" fontWeight="bold">X</text>
              <motion.circle
                cx="40" cy="40" r="24"
                fill="none" stroke="#7c3aed" strokeWidth="1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ originX: '40px', originY: '40px' }}
              />
            </svg>
            <div className="text-xs text-gray-500 font-medium mt-1">Step 3</div>
            <div className="text-[10px] text-gray-600 leading-relaxed mt-1">
              Before opening the box, quantum mechanics says the cat is both alive AND dead — a superposition of both states.
            </div>
          </div>

          <div className="md:col-span-1 bg-journey-surface rounded-lg p-4 border border-journey-accent/20 text-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-2">
              <rect x="10" y="20" width="60" height="40" rx="4" fill="#333" stroke="#555" strokeWidth="1" />
              <circle cx="60" cy="40" r="8" fill="none" stroke="#666" strokeWidth="2" />
              <text x="60" y="44" textAnchor="middle" fill="#666" fontSize="12" fontWeight="bold">?</text>
              <motion.circle
                cx="40" cy="40" r="32"
                fill="none" stroke="#ff00aa" strokeWidth="1.5" strokeDasharray="3 3"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                style={{ originX: '40px', originY: '40px' }}
              />
            </svg>
            <div className="text-xs text-gray-500 font-medium mt-1">Step 4</div>
            <div className="text-[10px] text-gray-600 leading-relaxed mt-1">
              Only when we OPEN the box (measure) does the superposition collapse to a single definite outcome.
            </div>
          </div>

          <div className="md:col-span-1 bg-journey-surface rounded-lg p-4 border border-journey-accent/20 text-center">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-2">
              <motion.ellipse
                cx="40" cy="45" rx="25" ry="20"
                fill="#3a5a3a"
                initial={{ fill: '#3a5a3a' }}
                animate={{ fill: ['#3a5a3a', '#5a3a3a', '#3a5a3a'] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <motion.circle
                cx="40" cy="30" r="14" fill="#4a5a4a"
                animate={{ fill: ['#4a5a4a', '#5a4a4a', '#4a5a4a'] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <text x="40" y="44" textAnchor="middle" fill="#aaa" fontSize="14" fontWeight="bold">50%</text>
              <text x="40" y="68" textAnchor="middle" fill="#666" fontSize="9">alive or dead</text>
            </svg>
            <div className="text-xs text-gray-500 font-medium mt-1">Outcome</div>
            <div className="text-[10px] text-gray-600 leading-relaxed mt-1">
              50% chance of finding a living cat, 50% chance of finding a dead cat — determined at the moment of observation.
            </div>
          </div>
        </div>

        <div className="bg-journey-surface rounded-lg p-4 border border-journey-accent/20">
          <p className="text-xs text-amber-200/60 leading-relaxed">
            <strong className="text-amber-200/80">The punchline:</strong> Schrodinger proposed this in 1935 to show that
            the Copenhagen interpretation leads to absurdity if taken literally — a cat cannot be both alive and dead.
            Modern physics resolves this via <strong className="text-amber-200/70">decoherence</strong>: the cat interacts
            with its environment so rapidly that any superposition collapses practically instantly. The cat is NEVER in
            a superposition — it's always definitely alive or dead from the start. But the radioactive atom that
            determines its fate? THAT was in a genuine quantum superposition before interacting with the detector.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
