'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export interface HistoryItem {
  year: number;
  scientist: string;
  story: string;
  quote?: {
    text: string;
    source: string;
  };
}

export default function HistoryCard({ items, concept }: { items: HistoryItem[]; concept: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-quantum-card rounded-xl border border-amber-800/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-amber-900/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">History</span>
          <span className="text-xs text-gray-500">— where this concept came from</span>
        </div>
        <span className={`text-amber-500 text-xs transition-transform ${open ? 'rotate-180' : ''}`}>{'\u25BC'}</span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-5 pb-5 space-y-4"
        >
          {items.map((item, i) => (
            <div key={i}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xs font-bold text-amber-500">{item.scientist}</span>
                <span className="text-[10px] text-gray-600">{item.year}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{item.story}</p>
              {item.quote && (
                <div className="mt-2 pl-3 border-l-2 border-amber-700/50">
                  <p className="text-xs italic text-amber-300/80 leading-relaxed">{'\u201C'}{item.quote.text}{'\u201D'}</p>
                  <p className="text-[10px] text-gray-600 mt-1">{'\u2014'} {item.quote.source}</p>
                </div>
              )}
            </div>
          ))}

          <p className="text-[10px] text-gray-700 italic pt-2 border-t border-gray-800/60">
            {concept} — still an active field of research today.
          </p>
        </motion.div>
      )}
    </div>
  );
}
