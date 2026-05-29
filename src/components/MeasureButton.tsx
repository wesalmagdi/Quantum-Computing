'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { measure } from '@/lib/quantum';

interface Props {
  theta: number;
  collapsed: boolean;
  collapsedValue: 0 | 1 | null;
  onMeasure: (result: 0 | 1) => void;
  onReset: () => void;
}

export default function MeasureButton({ theta, collapsed, collapsedValue, onMeasure, onReset }: Props) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (collapsed) {
      onReset();
      return;
    }

    setAnimating(true);
    setTimeout(() => {
      const result = measure(theta);
      onMeasure(result);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleClick}
        disabled={animating}
        className={`
          w-full py-3 px-6 rounded-xl font-bold text-base transition-all duration-200
          ${collapsed
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
            : 'bg-quantum-purple text-white hover:bg-purple-600 shadow-lg shadow-purple-500/20 active:scale-[0.98]'
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        {animating ? (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.4, repeat: Infinity }}
          >
            Measuring...
          </motion.span>
        ) : collapsed ? (
          '↺ Reset qubit'
        ) : (
          'Measure'
        )}
      </button>

      {collapsed && collapsedValue !== null && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center py-4 rounded-xl bg-black/30 border border-gray-800"
        >
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Collapsed to</div>
          <div
            className={`text-4xl font-bold ${collapsedValue === 0 ? 'text-quantum-cyan' : 'text-quantum-magenta'}`}
          >
            |{collapsedValue}⟩
          </div>
        </motion.div>
      )}
    </div>
  );
}
