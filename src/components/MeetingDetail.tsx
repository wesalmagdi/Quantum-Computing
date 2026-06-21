'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Meeting } from '@/lib/data';

export default function MeetingDetail({ meeting, onBack, onDeleted }: {
  meeting: Meeting;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const [items, setItems] = useState(meeting.actionItems);
  const [deleting, setDeleting] = useState(false);

  const toggleItem = async (idx: number) => {
    const updated = items.map((item, i) => i === idx ? { ...item, done: !item.done } : item);
    setItems(updated);
    await fetch(`/api/meetings/${meeting.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionItems: updated }),
    });
  };

  const handleDelete = async () => {
    if (!confirm('Delete this meeting?')) return;
    setDeleting(true);
    await fetch(`/api/meetings/${meeting.id}`, { method: 'DELETE' });
    onDeleted();
  };

  const doneCount = items.filter(i => i.done).length;
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <motion.button
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-journey-muted hover:text-journey-text mb-4 transition-colors group"
      >
        <motion.span
          animate={{ x: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >←</motion.span>
        <span>Back to meetings</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="bg-journey-card rounded-2xl border border-journey-border overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 p-6 border-b border-journey-border">
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute top-4 right-6 text-2xl opacity-20"
          >✦</motion.div>
          <div className="flex items-start justify-between gap-4 relative">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-journey-text"
              >
                {meeting.title}
              </motion.h1>
              <p className="text-sm text-journey-muted mt-1 font-mono">{meeting.date}</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0 px-3 py-1 rounded-lg hover:bg-red-500/10"
            >
              Delete
            </button>
          </div>

          {/* Progress bar */}
          {items.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-2 bg-journey-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-journey-primary to-indigo-400"
                />
              </div>
              <span className="text-[10px] font-bold text-journey-muted">{doneCount}/{items.length}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-xs uppercase tracking-widest font-bold text-journey-muted mb-3 flex items-center gap-2">
              <span>💬</span> What was discussed
            </h2>
            <div className="bg-journey-surface rounded-xl p-4 border border-journey-border">
              <p className="text-sm text-journey-text leading-relaxed whitespace-pre-wrap">{meeting.discussed}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xs uppercase tracking-widest font-bold text-journey-muted mb-3 flex items-center gap-2">
              <span>✅</span> Action Items ({doneCount}/{items.length})
            </h2>
            <div className="space-y-2">
              {items.map((item, i) => (
                <motion.label
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-journey-surface cursor-pointer group transition-colors"
                >
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleItem(i)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-journey-border peer-checked:border-journey-primary peer-checked:bg-journey-primary transition-all flex items-center justify-center">
                      {item.done && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                        >
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm flex-1 ${item.done ? 'line-through text-journey-muted' : 'text-journey-text'}`}>
                    {item.text}
                  </span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {meeting.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xs uppercase tracking-widest font-bold text-journey-muted mb-3 flex items-center gap-2">
                <span>📎</span> Attachments
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {meeting.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl border border-journey-border bg-journey-surface hover:bg-journey-primary/5 hover:border-journey-primary/30 transition-all text-sm text-journey-text group"
                  >
                    <span className="text-journey-muted group-hover:text-journey-primary transition-colors">📎</span>
                    <span className="truncate text-xs">{att.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
