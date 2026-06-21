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
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-journey-muted text-sm"
      >
        Loading journey...
      </motion.div>
    </div>
  );

  const meetingCount = timeline.filter(e => e.type === 'meeting').length;
  const milestoneCount = timeline.filter(e => e.type === 'milestone').length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-900 dark:via-indigo-800 dark:to-purple-900"
      >
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5"
        />
        <motion.div
          animate={{ rotate: [0, -5, 0, 5, 0], scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/5"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto text-center px-6 py-12 md:py-16 md:px-10">
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-6"
          >
            {journey.team.map((name, i) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.08, y: -2 }}
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 text-xs text-white/90"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${teamColors[i % 6]}`}>
                  {name[0]}
                </span>
                {name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-6 -mt-5 mb-8 relative z-10"
      >
        {[
          { value: meetingCount, label: 'Meetings', color: 'text-journey-primary' },
          { value: milestoneCount, label: 'Milestones', color: 'text-journey-accent' },
          { value: journey.team.length, label: 'Team', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            whileHover={{ y: -4, scale: 1.03 }}
            className="bg-journey-card border border-journey-border rounded-xl px-5 py-3 shadow-sm text-center"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-journey-muted font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="px-4 md:px-8 pb-12">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-journey-primary via-journey-accent to-journey-border" />

          <div className="space-y-8">
            {timeline.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -30, rotate: -2 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ delay: 0.45 + i * 0.12, duration: 0.4, ease: 'easeOut' }}
                className="relative pl-14"
              >
                <motion.div
                  className={`absolute left-[14px] top-1.5 w-[18px] h-[18px] rounded-full border-[3px] border-journey-card shadow-sm ${typeColors[entry.type] || 'bg-journey-muted'} flex items-center justify-center`}
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="bg-journey-card rounded-xl border border-journey-border p-5 shadow-sm hover:shadow-lg hover:border-journey-primary/20 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-journey-primary/0 via-journey-primary/0 to-journey-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
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
              </motion.div>
            ))}

            {/* Future milestone placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="relative pl-14"
            >
              <div className="absolute left-[14px] top-1.5 w-[18px] h-[18px] rounded-full border-[3px] border-dashed border-journey-border bg-journey-bg" />
              <div className="bg-journey-card/50 rounded-xl border border-dashed border-journey-border p-5">
                <div className="text-xs text-journey-muted/60 italic">More milestones to come...</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
