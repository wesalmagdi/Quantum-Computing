'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Meeting } from '@/lib/data';
import MeetingDetail from './MeetingDetail';
import MeetingForm from './MeetingForm';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 18 } },
};

const entryColors = ['#818cf8', '#22d3ee', '#34d399', '#f472b6', '#fbbf24'];

export default function MeetingList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch('/api/meetings').then(r => r.json()).then(setMeetings);
  }, [refresh]);

  const handleSaved = () => {
    setShowForm(false);
    setRefresh(n => n + 1);
  };

  const handleDeleted = () => {
    setSelected(null);
    setRefresh(n => n + 1);
  };

  if (selected) {
    return <MeetingDetail meeting={selected} onBack={() => setSelected(null)} onDeleted={handleDeleted} />;
  }

  const doneTotal = meetings.reduce((s, m) => s + m.actionItems.filter(a => a.done).length, 0);
  const allTotal = meetings.reduce((s, m) => s + m.actionItems.length, 0);
  const attachTotal = meetings.reduce((s, m) => s + m.attachments.length, 0);
  const pct = allTotal > 0 ? Math.round((doneTotal / allTotal) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-journey-border/30 px-4 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-journey-muted mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-journey-primary" style={{ boxShadow: '0 0 6px rgba(129,140,248,0.4)' }} />
              <span className="uppercase tracking-wider">Research Log</span>
              <span className="text-journey-border/40">/</span>
              <span>Sessions Archive</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-journey-text font-mono tracking-tight">
              <span className="text-journey-primary">◆</span> Meetings
            </h1>
            <p className="text-xs text-journey-muted/60 mt-1 font-mono">
              {meetings.length} session{meetings.length !== 1 ? 's' : ''} archived
              {allTotal > 0 && <span> · {doneTotal}/{allTotal} action items closed · {pct}% completion</span>}
              {attachTotal > 0 && <span> · {attachTotal} attachment{attachTotal !== 1 ? 's' : ''}</span>}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="px-4 py-2 text-xs font-mono font-bold rounded-lg border border-journey-primary/30 bg-journey-primary/10 text-journey-primary hover:bg-journey-primary/20 transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>New Session</span>
          </motion.button>
        </div>
      </div>

      {/* Stats — research metrics */}
      {meetings.length > 0 && (
        <div className="grid grid-cols-4 gap-px bg-journey-border/20 mx-4 md:mx-8 border-b border-journey-border/20">
          {[
            { value: meetings.length, label: 'Sessions', color: '#818cf8' },
            { value: `${doneTotal}/${allTotal}`, label: 'Tasks', color: '#22d3ee' },
            { value: attachTotal, label: 'Attachments', color: '#34d399' },
            { value: `${pct}%`, label: 'Progress', color: '#fbbf24' },
          ].map((s, i) => (
            <div key={s.label} className="bg-journey-card/30 p-3 text-center border border-journey-border/20">
              <div className="text-sm font-bold text-journey-text font-mono" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] font-mono text-journey-muted uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mx-4 md:mx-8"
          >
            <MeetingForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meeting entries */}
      {meetings.length === 0 && !showForm ? (
        <div className="text-center py-20 px-4">
          <div className="text-2xl mb-3 opacity-30">◇</div>
          <p className="text-sm text-journey-muted font-mono">No research sessions recorded</p>
          <p className="text-[11px] text-journey-muted/50 font-mono mt-1">Begin documenting your first meeting</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="mx-4 md:mx-8 mt-6 space-y-2">
          {meetings.map((m, idx) => {
            const color = entryColors[idx % entryColors.length];
            const done = m.actionItems.filter(a => a.done).length;
            const total = m.actionItems.length;
            return (
              <motion.div key={m.id} variants={item} layout>
                <motion.button
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(m)}
                  className="w-full text-left bg-journey-card/50 hover:bg-journey-card/70 rounded-lg border border-journey-border/20 hover:border-journey-border/50 transition-all p-4 group relative overflow-hidden"
                >
                  {/* Left color indicator */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
                  />

                  <div className="flex items-start gap-3 pl-2">
                    {/* Entry number */}
                    <div className="shrink-0 w-8 text-right">
                      <span className="text-[10px] font-mono text-journey-muted/40">{String(idx + 1).padStart(2, '0')}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-journey-muted/50 mb-0.5">
                        <span>{m.date}</span>
                        {total > 0 && <span>· {done}/{total} closed</span>}
                      </div>
                      <h3 className="text-sm font-bold text-journey-text group-hover:text-journey-primary transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-xs text-journey-muted/60 mt-1 line-clamp-1 leading-relaxed">{m.discussed}</p>

                      {/* Footer tags */}
                      <div className="flex items-center gap-2 mt-2">
                        {m.attachments.length > 0 && (
                          <span className="text-[9px] font-mono text-journey-muted/50 flex items-center gap-1">
                            📎 {m.attachments.length}
                          </span>
                        )}
                        {total > 0 && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1 rounded-full bg-journey-surface overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.round((done / total) * 100)}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 text-journey-muted/20 group-hover:text-journey-primary/40 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
