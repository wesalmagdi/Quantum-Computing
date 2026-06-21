'use client';

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
          <span className="text-lg text-journey-primary">{'\u25C8'}</span>
          <span className="text-xs font-semibold text-journey-text hidden sm:inline">Journey</span>
        </div>
        <div className="flex gap-1 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${active === tab.id
                  ? 'bg-journey-primary text-white shadow-lg shadow-journey-primary/20'
                  : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
