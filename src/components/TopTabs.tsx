'use client';

import type { Tab, TabId } from '@/lib/data';

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'meetings', label: 'Meetings', icon: '⟐' },
  { id: 'study', label: 'Study Notes', icon: '◈' },
];

export default function TopTabs({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  return (
    <div className="flex border-b border-journey-border bg-white">
      <div className="flex gap-1 p-1.5 max-w-2xl mx-auto w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${active === tab.id
                ? 'bg-journey-primary text-white shadow-lg shadow-indigo-200'
                : 'text-journey-muted hover:text-journey-text hover:bg-journey-surface'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
