'use client';

import { motion } from 'framer-motion';
import type { Tab, TabId } from '@/lib/data';
import ThemeToggle from './ThemeToggle';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '✦' },
  { id: 'meetings', label: 'Meetings', icon: '◆' },
  { id: 'study', label: 'Study Notes', icon: '⬡' },
];

export default function TopTabs({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  return (
    <div className="flex border-b border-journey-border bg-journey-card/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-1.5 p-2 max-w-4xl mx-auto w-full">
        <motion.div
          animate={{ rotate: [0, 10, 0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="flex items-center gap-1.5 mr-2 pl-1.5"
        >
          <span className="text-lg" style={{ color: '#818cf8' }}>✦</span>
          <span className="text-xs font-bold text-journey-text hidden sm:inline bg-gradient-to-r from-journey-primary to-journey-accent bg-clip-text text-transparent">Journey</span>
        </motion.div>

        <div className="flex gap-1 flex-1 relative">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative
                ${active === tab.id ? 'text-white' : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface'}
              `}
            >
              {active === tab.id && (
                <motion.div
                  layoutId="tabBg"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-journey-primary to-indigo-500 shadow-lg shadow-journey-primary/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-xs">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
