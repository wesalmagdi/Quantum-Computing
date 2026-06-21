'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { JourneyInfo, TimelineEntry } from '@/lib/data';

const typeConfig: Record<string, { color: string; icon: string; label: string }> = {
  milestone: { color: 'from-amber-400 to-orange-500', icon: '🏆', label: 'Milestone' },
  meeting: { color: 'from-indigo-400 to-purple-500', icon: '📋', label: 'Meeting' },
  study: { color: 'from-emerald-400 to-teal-500', icon: '📚', label: 'Study' },
  other: { color: 'from-gray-400 to-slate-500', icon: '📌', label: 'Other' },
};

const teamColors = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#06b6d4', '#8b5cf6'];

const AnimatedNumber = ({ n }: { n: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const dur = 600;
    const step = Date.now();
    const raf = () => {
      const t = Math.min((Date.now() - step) / dur, 1);
      setVal(Math.floor(t * n));
      if (t < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [n]);
  return <>{val}</>;
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

  if (!journey) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-3xl" style={{ color: '#818cf8' }}
      >✦</motion.div>
    </div>
  );

  const meetingCount = timeline.filter(e => e.type === 'meeting').length;
  const milestoneCount = timeline.filter(e => e.type === 'milestone').length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* === HERO === */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-950 dark:via-purple-900 dark:to-pink-950">
        {/* Decorative shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-8 left-8 text-3xl opacity-30"
        >✦</motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
          className="absolute top-12 right-16 text-2xl opacity-25"
        >⬡</motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-12 left-12 text-2xl opacity-20"
        >◆</motion.div>
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-8 right-8 text-lg opacity-25"
        >◇</motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_60%)]" />

        <div className="relative px-6 py-14 md:py-20 md:px-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-3 tracking-tight"
          >
            {journey.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-200/80 text-sm md:text-base max-w-md mx-auto"
          >
            {journey.subtitle}
          </motion.p>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-6"
          >
            {journey.team.map((name, i) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full pl-1.5 pr-4 py-1 text-sm text-white/90 border border-white/10 shadow-lg"
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner"
                  style={{ backgroundColor: teamColors[i % 6] }}
                >
                  {name[0]}
                </span>
                {name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* === STATS === */}
      <div className="flex items-center justify-center gap-4 -mt-6 mb-8 relative z-10 px-4 flex-wrap">
        {[
          { value: meetingCount, label: 'Meetings', emoji: '📋', color: 'from-indigo-400 to-purple-500' },
          { value: milestoneCount, label: 'Milestones', emoji: '🏆', color: 'from-amber-400 to-orange-500' },
          { value: journey.team.length, label: 'Team', emoji: '👥', color: 'from-emerald-400 to-teal-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -6, scale: 1.05 }}
            className="bg-journey-card border border-journey-border rounded-2xl px-6 py-4 shadow-sm hover:shadow-lg transition-all flex items-center gap-4"
          >
            <span className="text-2xl">{stat.emoji}</span>
            <div className="text-left">
              <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                <AnimatedNumber n={stat.value} />
              </div>
              <div className="text-[10px] uppercase tracking-widest text-journey-muted font-semibold">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === TIMELINE === */}
      <div className="px-4 md:px-8 pb-16">
        <div className="relative max-w-2xl mx-auto">
          {/* Animated gradient line */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute left-[22px] top-2 w-[3px] rounded-full bg-gradient-to-b from-indigo-400 via-purple-400 to-amber-400"
          />

          <div className="space-y-10">
            {timeline.map((entry, i) => {
              const cfg = typeConfig[entry.type] || typeConfig.other;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15, type: 'spring', stiffness: 150, damping: 15 }}
                  className="relative pl-16"
                >
                  {/* Animated dot */}
                  <motion.div
                    className="absolute left-[14px] top-1 z-10 w-[19px] h-[19px] rounded-full border-[3px] border-journey-card shadow-md flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${entry.type === 'meeting' ? '#6366f1' : entry.type === 'milestone' ? '#f59e0b' : '#10b981'}, ${entry.type === 'meeting' ? '#8b5cf6' : entry.type === 'milestone' ? '#f97316' : '#14b8a6'})` }}
                    whileHover={{ scale: 1.8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-[5px] h-[5px] rounded-full bg-white" />
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -3 }}
                    className="bg-journey-card rounded-2xl border border-journey-border p-5 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                  >
                    {/* Colored top accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cfg.color}`} />

                    <div className="flex items-start gap-4 relative">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${entry.type === 'meeting' ? '#6366f1' : entry.type === 'milestone' ? '#f59e0b' : '#10b981'}15, ${entry.type === 'meeting' ? '#8b5cf6' : entry.type === 'milestone' ? '#f97316' : '#14b8a6'}10)` }}
                      >
                        {cfg.icon}
                      </motion.div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-journey-muted font-mono">{entry.date}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold text-white bg-gradient-to-r ${cfg.color}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-journey-text group-hover:text-journey-primary transition-colors">{entry.title}</h3>
                        <p className="text-sm text-journey-muted mt-1.5 leading-relaxed">{entry.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}

            {/* Future placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="relative pl-16"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute left-[14px] top-1 z-10 w-[19px] h-[19px] rounded-full border-[3px] border-dashed border-journey-border bg-journey-bg flex items-center justify-center"
              >
                <div className="w-[5px] h-[5px] rounded-full bg-journey-muted" />
              </motion.div>
              <div className="bg-journey-card/50 rounded-2xl border border-dashed border-journey-border p-5">
                <div className="flex items-center gap-3">
                  <span className="text-lg">✨</span>
                  <div>
                    <div className="text-sm font-medium text-journey-muted/70">More milestones coming soon...</div>
                    <div className="text-[10px] text-journey-muted/50 mt-0.5">Every great journey has many chapters</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
