'use client';

import { motion } from 'framer-motion';
import { getProbabilities } from '@/lib/quantum';

export default function ProbabilityDisplay({ theta }: { theta: number }) {
  const { p0, p1 } = getProbabilities(theta);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-journey-muted uppercase tracking-widest">Probability</h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-journey-primary font-medium">|0⟩</span>
            <span className="text-journey-muted tabular-nums">{(p0 * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 bg-journey-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-journey-primary rounded-full"
              animate={{ width: `${p0 * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-journey-accent font-medium">|1⟩</span>
            <span className="text-journey-muted tabular-nums">{(p1 * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2.5 bg-journey-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-journey-accent rounded-full"
              animate={{ width: `${p1 * 100}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
        </div>
      </div>

      <div className="flex h-5 rounded-full overflow-hidden border border-journey-border">
        <motion.div
          className="bg-journey-primary"
          animate={{ flex: p0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
        <motion.div
          className="bg-journey-accent"
          animate={{ flex: p1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
