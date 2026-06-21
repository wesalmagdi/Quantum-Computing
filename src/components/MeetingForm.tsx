'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function MeetingForm({ onSaved, onCancel }: {
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [discussed, setDiscussed] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSaving(true);
    await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), date, discussed: discussed.trim(), actionItems: [], attachments: [] }),
    });
    setSaving(false);
    onSaved();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onSubmit={handleSubmit}
      className="bg-journey-card rounded-2xl border border-journey-border p-6 shadow-sm overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
      <h2 className="text-sm font-bold text-journey-text mb-5 flex items-center gap-2">
        <span className="text-lg">✨</span> New Meeting
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Sprint Planning — Week 5"
            className="w-full px-4 py-2.5 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text transition-all"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text transition-all"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">What was discussed</label>
          <textarea
            value={discussed}
            onChange={e => setDiscussed(e.target.value)}
            rows={4}
            placeholder="Notes from the meeting..."
            className="w-full px-4 py-2.5 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text resize-y transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-5">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={saving || !title.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-journey-primary to-indigo-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-journey-primary/30 disabled:opacity-50 transition-all"
        >
          {saving ? 'Saving...' : 'Save Meeting'}
        </motion.button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm text-journey-muted hover:text-journey-text transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}
