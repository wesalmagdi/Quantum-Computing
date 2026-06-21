'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { JourneyInfo, TimelineEntry } from '@/lib/data';

const typeColors: Record<string, string> = {
  milestone: 'bg-journey-accent',
  meeting: 'bg-journey-primary',
  study: 'bg-emerald-500',
  other: 'bg-journey-muted',
};

const typeLabels: Record<string, string> = {
  milestone: 'Milestone',
  meeting: 'Meeting',
  study: 'Study',
  other: 'Other',
};

const teamColors = ['bg-indigo-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-cyan-500', 'bg-violet-500'];

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

  if (!journey) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-journey-muted text-sm">Loading journey...</div>
    </div>
  );

  const meetingCount = timeline.filter(e => e.type === 'meeting').length;
  const milestoneCount = timeline.filter(e => e.type === 'milestone').length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-900 dark:via-indigo-800 dark:to-purple-900 px-6 py-12 md:py-16 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight"
          >
            {journey.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto"
          >
            {journey.subtitle}
          </motion.p>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-6"
          >
            {journey.team.map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 text-xs text-white/90"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${teamColors[i % 6]}`}>
                  {name[0]}
                </span>
                {name}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 -mt-5 mb-8 relative z-10">
        <div className="bg-journey-card border border-journey-border rounded-xl px-5 py-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-journey-primary">{meetingCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-journey-muted font-medium">Meetings</div>
        </div>
        <div className="bg-journey-card border border-journey-border rounded-xl px-5 py-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-journey-accent">{milestoneCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-journey-muted font-medium">Milestones</div>
        </div>
        <div className="bg-journey-card border border-journey-border rounded-xl px-5 py-3 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-500">{journey.team.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-journey-muted font-medium">Team</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 md:px-8 pb-12">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-journey-primary via-journey-accent to-journey-border" />

          <div className="space-y-8">
            {timeline.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="relative pl-14"
              >
                {/* Dot */}
                <div className={`absolute left-[14px] top-1.5 w-[18px] h-[18px] rounded-full border-[3px] border-journey-card shadow-sm ${typeColors[entry.type] || 'bg-journey-muted'} flex items-center justify-center`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Card */}
                <div className="bg-journey-card rounded-xl border border-journey-border p-5 shadow-sm hover:shadow-md hover:border-journey-primary/20 transition-all group">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-journey-muted font-medium">{entry.date}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium text-white ${typeColors[entry.type] || 'bg-journey-muted'}`}>
                      {typeLabels[entry.type] || entry.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-journey-text">{entry.title}</h3>
                  <p className="text-sm text-journey-muted mt-1.5 leading-relaxed">{entry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
