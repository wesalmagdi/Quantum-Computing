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
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      onSubmit={handleSubmit}
      className="bg-journey-card rounded-xl border border-journey-border p-5 shadow-sm"
    >
      <h2 className="text-sm font-semibold text-journey-text mb-4">New Meeting</h2>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-journey-muted mb-1 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Sprint Planning — Week 5"
            className="w-full px-3 py-2 text-sm border border-journey-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-journey-muted mb-1 block">Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-journey-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text"
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-journey-muted mb-1 block">What was discussed</label>
          <textarea
            value={discussed}
            onChange={e => setDiscussed(e.target.value)}
            rows={4}
            placeholder="Notes from the meeting..."
            className="w-full px-3 py-2 text-sm border border-journey-border rounded-lg focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text resize-y"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={saving || !title.trim()}
          className="px-4 py-2 bg-journey-primary text-white text-sm font-medium rounded-lg hover:bg-journey-primary-dark disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save Meeting'}
        </motion.button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-journey-muted hover:text-journey-text transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}
