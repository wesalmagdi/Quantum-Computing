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
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
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

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-journey-text">Meetings</h1>
          <p className="text-sm text-journey-muted mt-0.5">{meetings.length} meeting{meetings.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-journey-primary text-white text-sm font-medium rounded-lg hover:bg-journey-primary-dark transition-colors shadow-sm"
        >
          + New Meeting
        </motion.button>
      </motion.div>

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

      {meetings.length === 0 && !showForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-journey-muted"
        >
          <div className="text-5xl mb-4">⟐</div>
          <p className="text-lg mb-1">No meetings yet</p>
          <p className="text-sm">Click &quot;+ New Meeting&quot; to document your first session.</p>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          <AnimatePresence>
            {meetings.map(m => (
              <motion.div key={m.id} variants={item} layout>
                <motion.button
                  whileHover={{ scale: 1.01, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelected(m)}
                  className="w-full text-left bg-journey-card rounded-xl border border-journey-border p-4 shadow-sm hover:shadow-lg hover:border-journey-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-journey-primary/0 via-journey-primary/0 to-journey-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start justify-between gap-4 relative">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-journey-text text-sm group-hover:text-journey-primary transition-colors">{m.title}</h3>
                      <p className="text-xs text-journey-muted mt-0.5">{m.date}</p>
                      <p className="text-xs text-journey-muted mt-1.5 line-clamp-2">{m.discussed}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-journey-muted bg-journey-surface px-2 py-0.5 rounded-full">
                        {m.actionItems.filter(a => a.done).length}/{m.actionItems.length} done
                      </span>
                      {m.attachments.length > 0 && (
                        <span className="text-[10px] text-journey-muted">{m.attachments.length} file{m.attachments.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
