'use client';

import { motion } from 'framer-motion';
import type { Tab, TabId } from '@/lib/data';
import ThemeToggle from './ThemeToggle';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'meetings', label: 'Meetings', icon: '⟐' },
  { id: 'study', label: 'Study Notes', icon: '◈' },
];

export default function TopTabs({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  return (
    <div className="flex border-b border-journey-border bg-journey-card/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-1 p-1.5 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-1.5 mr-2 pl-1">
          <motion.span
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="text-lg text-journey-primary"
          >
            {'\u25C8'}
          </motion.span>
          <span className="text-xs font-semibold text-journey-text hidden sm:inline">Journey</span>
        </div>
        <div className="flex gap-1 flex-1 relative">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors relative
                ${active === tab.id
                  ? 'text-white'
                  : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface'
                }
              `}
            >
              {active === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-journey-primary rounded-lg shadow-lg shadow-journey-primary/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
