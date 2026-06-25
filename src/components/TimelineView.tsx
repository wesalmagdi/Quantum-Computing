'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { JourneyInfo, TimelineEntry } from '@/lib/data';

const teamColors = ['#818cf8', '#22d3ee', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

const AnimatedNumber = ({ n }: { n: number }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = performance.now();
    const dur = 800;
    const raf = () => {
      const t = Math.min((performance.now() - start) / dur, 1);
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
  const canvasRef = useRef<HTMLDivElement>(null);

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
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-3xl"
        style={{ color: '#818cf8', textShadow: '0 0 20px rgba(129,140,248,0.3)' }}
      >✦</motion.div>
    </div>
  );

  const meetingCount = timeline.filter(e => e.type === 'meeting').length;
  const milestoneCount = timeline.filter(e => e.type === 'milestone').length;
  const totalTimelineEntries = timeline.length;

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Hero Section — Research Terminal Header */}
      <div className="relative overflow-hidden border-b border-journey-border/40">
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(129,140,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative px-6 py-12 md:py-16 md:px-10">
          {/* Terminal bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-journey-border/40 bg-journey-surface/30 mb-6 text-[10px] tracking-wider text-journey-muted font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.4)' }} />
            <span>quantum-journal</span>
            <span className="text-journey-border">~</span>
            <span>research log</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-xl">
              <motion.h1
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 16 }}
                className="text-4xl md:text-5xl font-black text-journey-text tracking-tight leading-[1.1]"
              >
                {journey.title.split(' ').map((word, i, arr) =>
                  i === arr.length - 1
                    ? <span key={i} className="bg-gradient-to-r from-journey-primary to-journey-accent bg-clip-text text-transparent">{word}</span>
                    : <span key={i}>{word} </span>
                )}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-journey-muted mt-2 max-w-lg leading-relaxed"
              >
                {journey.description}
              </motion.p>
            </div>

            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-journey-primary/20 bg-journey-primary/5 shrink-0"
            >
              <motion.span
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-journey-accent"
                style={{ boxShadow: '0 0 8px rgba(34,211,238,0.5)' }}
              />
              <span className="text-xs font-mono text-journey-muted">
                <span className="text-journey-accent">active</span> · {journey.startDate}
              </span>
            </motion.div>
          </div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-2 mt-6"
          >
            <span className="text-[10px] uppercase tracking-wider text-journey-muted font-mono mr-1">Research Team</span>
            {journey.team.map((name, i) => (
              <motion.span
                key={name}
                whileHover={{ y: -2 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-journey-border/40 text-xs text-journey-text/70 font-mono"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: teamColors[i], boxShadow: `0 0 6px ${teamColors[i]}40` }} />
                {name}
              </motion.span>
            ))}
            <span className="text-[10px] text-journey-muted font-mono ml-1">×{journey.team.length}</span>
          </motion.div>
        </div>
      </div>

      {/* Stats — Scientific readouts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-journey-border/20 mx-4 md:mx-10 border-x border-journey-border/20">
        {[
          { value: meetingCount, label: 'Meetings', icon: '◆', color: '#818cf8' },
          { value: milestoneCount, label: 'Milestones', icon: '◇', color: '#fbbf24' },
          { value: totalTimelineEntries, label: 'Entries', icon: '⬡', color: '#22d3ee' },
          { value: journey.team.length, label: 'Researchers', icon: '◈', color: '#34d399' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="bg-journey-card/40 p-4 md:p-5 text-center border border-journey-border/20"
          >
            <div className="text-xs text-journey-muted font-mono mb-2 flex items-center justify-center gap-1.5">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="uppercase tracking-wider text-[10px]">{stat.label}</span>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-journey-text font-mono">
              <AnimatedNumber n={stat.value} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sub-navigation: Research Journal + Progress */}
      <div className="px-4 md:px-10 mt-10 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-sm font-bold text-journey-text font-mono uppercase tracking-wider">
            <span className="text-journey-primary mr-2">◆</span>
            Research Timeline
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-journey-primary/20 via-journey-accent/10 to-transparent" />
        </div>

        {/* Progress — quantum-style indicator */}
        <div className="flex items-center gap-3 mb-8 p-3 rounded-lg border border-journey-border/20 bg-journey-card/30">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-journey-muted uppercase tracking-wider">Project Progress</span>
              <span className="text-[10px] font-mono text-journey-primary">
                {meetingCount > 0 ? Math.min(100, Math.round((meetingCount / 8) * 100)) : 0}%
              </span>
            </div>
            <div className="h-1.5 bg-journey-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${meetingCount > 0 ? Math.min(100, Math.round((meetingCount / 8) * 100)) : 0}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-journey-primary via-journey-accent to-journey-accent"
                style={{ boxShadow: '0 0 12px rgba(129,140,248,0.3)' }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-journey-muted border-l border-journey-border/30 pl-3">
            <span className="w-1.5 h-1.5 rounded-full bg-journey-accent" style={{ boxShadow: '0 0 6px rgba(34,211,238,0.4)' }} />
            <span>Phase I: Foundation</span>
          </div>
        </div>
      </div>

      {/* Constellation Timeline */}
      <div className="px-4 md:px-10">
        <div className="relative" ref={canvasRef}>
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: timeline.length * 120 + 80 }}>
            {timeline.map((_, i) => {
              if (i === 0) return null;
              return (
                <motion.line
                  key={`conn-${i}`}
                  x1="28" y1={40 + (i - 1) * 120 + 60}
                  x2="28" y2={40 + i * 120}
                  stroke="rgba(129,140,248,0.15)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                />
              );
            })}
            {/* Animated glowing line */}
            {timeline.length > 1 && (
              <motion.line
                x1="28" y1={40 + 60}
                x2="28" y2={40 + (timeline.length - 1) * 120 + 40}
                stroke="#818cf8"
                strokeWidth="1"
                strokeOpacity="0.3"
                style={{ filter: 'blur(3px)' }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
            )}
          </svg>

          <div className="space-y-0 relative">
            {timeline.map((entry, i) => {
              const isLast = i === timeline.length - 1;
              const isMeeting = entry.type === 'meeting';
              const isMilestone = entry.type === 'milestone';
              const accentColor = isMeeting ? '#818cf8' : isMilestone ? '#fbbf24' : '#22d3ee';

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12, type: 'spring', stiffness: 150, damping: 16 }}
                  className="relative pl-14 pb-8 last:pb-0 group"
                >
                  {/* Node dot */}
                  <div className="absolute left-[20px] top-1 z-10">
                    <motion.div
                      className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center`}
                      style={{
                        borderColor: accentColor,
                        backgroundColor: `${accentColor}15`,
                        boxShadow: isLast
                          ? `0 0 12px ${accentColor}40, 0 0 24px ${accentColor}20`
                          : `0 0 8px ${accentColor}20`,
                      }}
                      whileHover={{ scale: 1.8 }}
                      animate={isLast ? { boxShadow: [`0 0 8px ${accentColor}20`, `0 0 20px ${accentColor}50`, `0 0 8px ${accentColor}20`] } : {}}
                      transition={isLast ? { repeat: Infinity, duration: 2.5 } : {}}
                    >
                      <div
                        className="w-[6px] h-[6px] rounded-full"
                        style={{ backgroundColor: accentColor, boxShadow: `0 0 6px ${accentColor}` }}
                      />
                    </motion.div>
                  </div>

                  {/* Entry card — Research log style */}
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="bg-journey-card/60 backdrop-blur-sm rounded-lg border border-journey-border/30 p-4 hover:border-journey-border/60 transition-all shadow-sm relative overflow-hidden group"
                  >
                    {/* Top accent line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1.5px] opacity-60"
                      style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
                    />

                    <div className="flex items-start gap-3">
                      {/* Left metadata */}
                      <div className="shrink-0 w-16 text-right">
                        <div className="text-[10px] font-mono text-journey-muted/60">{entry.date}</div>
                        <div
                          className="text-[9px] font-mono uppercase tracking-wider mt-1"
                          style={{ color: accentColor }}
                        >
                          {entry.type}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-journey-text group-hover:text-journey-primary transition-colors">
                          {entry.title}
                        </h3>
                        <p className="text-xs text-journey-muted/70 mt-1 leading-relaxed line-clamp-2">
                          {entry.description}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-2 mt-2.5">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border"
                            style={{
                              borderColor: `${accentColor}30`,
                              color: accentColor,
                              backgroundColor: `${accentColor}08`,
                            }}
                          >
                            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                            {entry.type === 'meeting' ? 'Research Session' : entry.type === 'milestone' ? 'Milestone' : 'Entry'}
                          </span>
                          {i === timeline.length - 1 && (
                            <span className="text-[9px] font-mono text-journey-accent flex items-center gap-1">
                              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>●</motion.span>
                              Current
                            </span>
                          )}
                        </div>
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
              transition={{ delay: 0.8 }}
              className="relative pl-14 pb-4"
            >
              <div className="absolute left-[20px] top-1 z-10">
                <div className="w-[16px] h-[16px] rounded-full border-2 border-dashed border-journey-border/30 flex items-center justify-center bg-journey-bg">
                  <div className="w-[6px] h-[6px] rounded-full bg-journey-border/20" />
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-journey-border/20 p-4 bg-journey-card/20">
                <div className="flex items-center gap-3">
                  <span className="text-journey-muted/40 text-sm">◇</span>
                  <div>
                    <div className="text-xs text-journey-muted/50 font-mono">Future sessions queued</div>
                    <div className="text-[9px] text-journey-muted/30 font-mono mt-0.5">The research continues...</div>
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
