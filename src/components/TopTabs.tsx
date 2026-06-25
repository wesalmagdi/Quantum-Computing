'use client';

import { motion } from 'framer-motion';
import type { Tab, TabId } from '@/lib/data';
import ThemeToggle from './ThemeToggle';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '✦' },
  { id: 'meetings', label: 'Meetings', icon: '◆' },
  { id: 'study', label: 'Study Notes', icon: '⬡' },
  { id: 'knowledge', label: 'Knowledge Map', icon: '◈' },
];

export default function TopTabs({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-journey-border/60 bg-journey-bg/90 backdrop-blur-xl">
      <div className="flex items-center gap-1.5 px-3 py-1.5 max-w-5xl mx-auto w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mr-3 pl-1 shrink-0"
        >
          <span className="relative flex items-center justify-center w-6 h-6">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute inset-0 border border-journey-primary/40 rounded-full"
            />
            <motion.span
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
              className="absolute w-3 h-[1.5px] bg-journey-primary"
              style={{ boxShadow: '0 0 6px var(--journey-primary)' }}
            />
            <span className="text-[10px] font-bold text-journey-primary">◇</span>
          </span>
          <span className="hidden sm:inline text-[11px] font-bold tracking-wider text-journey-text/80 uppercase">
            <span className="text-journey-primary">Quantum</span> Journal
          </span>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-0.5 flex-1 relative">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id as TabId)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors relative
                ${active === tab.id
                  ? 'text-white'
                  : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface/40'
                }
              `}
            >
              {active === tab.id && (
                <motion.div
                  layoutId="tabGlow"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-journey-primary/20 via-journey-accent/10 to-transparent border border-journey-primary/20"
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <span className="text-[10px] opacity-70">{tab.icon}</span>
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
}
