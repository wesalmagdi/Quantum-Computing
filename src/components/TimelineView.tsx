'use client';

import { useEffect, useState } from 'react';
import type { JourneyInfo, TimelineEntry } from '@/lib/data';

const typeColors: Record<string, string> = {
  milestone: 'bg-journey-accent text-white',
  meeting: 'bg-journey-primary text-white',
  study: 'bg-emerald-500 text-white',
  other: 'bg-journey-muted text-white',
};

const typeLabels: Record<string, string> = {
  milestone: 'Milestone',
  meeting: 'Meeting',
  study: 'Study',
  other: 'Other',
};

export default function TimelineView() {
  const [journey, setJourney] = useState<JourneyInfo | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/journey').then(r => r.json()),
      fetch('/api/timeline').then(r => r.json()),
    ]).then(([j, t]) => {
      setJourney(j);
      setTimeline(t);
    });
  }, []);

  if (!journey) return <div className="p-8 text-center text-journey-muted">Loading journey...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-journey-text mb-2">{journey.title}</h1>
        <p className="text-journey-muted text-sm">{journey.subtitle}</p>
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-journey-muted">
          <span>Team: {journey.team.join(', ')}</span>
          <span className="w-1 h-1 rounded-full bg-journey-border" />
          <span>Started: {journey.startDate}</span>
        </div>
        <p className="mt-4 text-sm text-journey-muted max-w-xl mx-auto">{journey.description}</p>
      </div>

      <div className="relative">
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-journey-border" />

        <div className="space-y-6">
          {timeline.map(entry => (
            <div key={entry.id} className="relative pl-12 md:pl-14">
              <div className={`absolute left-2.5 md:left-4.5 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm ${typeColors[entry.type] || 'bg-journey-muted'}`} />

              <div className="bg-white rounded-xl border border-journey-border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-journey-muted">{entry.date}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${typeColors[entry.type] || 'bg-journey-surface text-journey-muted'}`}>
                    {typeLabels[entry.type] || entry.type}
                  </span>
                </div>
                <h3 className="font-semibold text-journey-text text-sm">{entry.title}</h3>
                <p className="text-xs text-journey-muted mt-1">{entry.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
