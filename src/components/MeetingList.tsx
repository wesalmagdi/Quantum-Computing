'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Meeting } from '@/lib/data';
import MeetingDetail from './MeetingDetail';
import MeetingForm from './MeetingForm';

const cardColors = [
  { border: 'border-l-indigo-400', dot: 'bg-indigo-400' },
  { border: 'border-l-amber-400', dot: 'bg-amber-400' },
  { border: 'border-l-emerald-400', dot: 'bg-emerald-400' },
  { border: 'border-l-rose-400', dot: 'bg-rose-400' },
  { border: 'border-l-cyan-400', dot: 'bg-cyan-400' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } },
};

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

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-journey-text flex items-center gap-2">
            <span className="text-2xl">📋</span> Meetings
          </h1>
          <p className="text-sm text-journey-muted mt-0.5">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
            {allTotal > 0 && ` · ${doneTotal}/${allTotal} tasks done`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-journey-primary to-indigo-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-journey-primary/30 transition-all shadow-sm"
        >
          + New Meeting
        </motion.button>
      </motion.div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <MeetingForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty */}
      {meetings.length === 0 && !showForm ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 text-journey-muted"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-6xl mb-4"
          >📋</motion.div>
          <p className="text-lg font-medium text-journey-text mb-1">No meetings recorded yet</p>
          <p className="text-sm">Click the button above to document your first session!</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {meetings.map((m, idx) => (
            <motion.div key={m.id} variants={item} layout>
              <motion.button
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(m)}
                className={`w-full text-left bg-journey-card rounded-2xl border border-journey-border border-l-4 ${cardColors[idx % cardColors.length].border} p-5 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-journey-primary/[0.02] to-transparent" />
                <div className="flex items-start justify-between gap-4 relative">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${cardColors[idx % cardColors.length].dot}`} />
                      <h3 className="font-bold text-journey-text group-hover:text-journey-primary transition-colors">{m.title}</h3>
                    </div>
                    <p className="text-xs text-journey-muted font-mono">{m.date}</p>
                    <p className="text-xs text-journey-muted mt-2 line-clamp-2">{m.discussed}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-[10px] font-bold text-journey-muted bg-journey-surface px-3 py-1 rounded-full"
                    >
                      {m.actionItems.filter(a => a.done).length}/{m.actionItems.length} ✓
                    </motion.div>
                    {m.attachments.length > 0 && (
                      <span className="text-[10px] text-journey-muted">📎 {m.attachments.length}</span>
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
