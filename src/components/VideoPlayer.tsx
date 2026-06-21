'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoPlayer({ videoId, title, description }: {
  videoId: string;
  title: string;
  description: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-journey-border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 p-4 hover:bg-journey-surface transition-colors text-left"
      >
        <span className="text-lg">▶️</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-journey-text truncate">{title}</div>
          <div className="text-xs text-journey-muted truncate">{description}</div>
        </div>
        <span className={`text-journey-muted text-sm transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={title}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
