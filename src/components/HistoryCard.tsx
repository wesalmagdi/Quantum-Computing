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
    <div className="bg-white rounded-xl border border-journey-accent/20 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-journey-surface transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-bold text-journey-accent">History</span>
          <span className="text-xs text-journey-muted">— where this concept came from</span>
        </div>
        <span className={`text-journey-accent text-xs transition-transform ${open ? 'rotate-180' : ''}`}>{'\u25BC'}</span>
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
                <span className="text-xs font-bold text-journey-accent">{item.scientist}</span>
                <span className="text-[10px] text-journey-muted">{item.year}</span>
              </div>
              <p className="text-xs text-journey-muted leading-relaxed">{item.story}</p>
              {item.quote && (
                <div className="mt-2 pl-3 border-l-2 border-journey-accent/30">
                  <p className="text-xs italic text-journey-accent/80 leading-relaxed">{'\u201C'}{item.quote.text}{'\u201D'}</p>
                  <p className="text-[10px] text-journey-muted mt-1">{'\u2014'} {item.quote.source}</p>
                </div>
              )}
            </div>
          ))}

          <p className="text-[10px] text-journey-text italic pt-2 border-t border-journey-border">
            {concept} — still an active field of research today.
          </p>
        </motion.div>
      )}
    </div>
  );
}
