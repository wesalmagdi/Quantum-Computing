'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Attachment } from '@/lib/data';

export default function MeetingForm({ onSaved, onCancel }: {
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [discussed, setDiscussed] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addItem = () => {
    if (!newItem.trim()) return;
    setActionItems(prev => [...prev, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (idx: number) => {
    setActionItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        setAttachments(prev => [...prev, { url: data.url, name: data.name }]);
      } catch {}
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setSaving(true);
    await fetch('/api/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        date,
        discussed: discussed.trim(),
        actionItems: actionItems.map(t => ({ text: t, done: false })),
        attachments,
      }),
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

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sprint Planning — Week 5"
            className="w-full px-4 py-2.5 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text transition-all" required />
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text transition-all" required />
        </div>

        {/* Discussion */}
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">What was discussed</label>
          <textarea value={discussed} onChange={e => setDiscussed(e.target.value)} rows={4}
            placeholder="Notes from the meeting..."
            className="w-full px-4 py-2.5 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text resize-y transition-all" />
        </div>

        {/* Action Items */}
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">
            Action Items {actionItems.length > 0 && <span className="text-journey-primary">({actionItems.length})</span>}
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
              placeholder="Add an action item..." className="flex-1 px-3 py-2 text-sm border border-journey-border rounded-xl focus:outline-none focus:ring-2 focus:ring-journey-primary/30 focus:border-journey-primary bg-journey-bg text-journey-text" />
            <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={addItem}
              className="px-3 py-2 bg-journey-surface text-journey-text rounded-xl hover:bg-journey-border transition-colors text-sm font-medium shrink-0">
              + Add
            </motion.button>
          </div>
          <AnimatePresence>
            {actionItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-journey-surface mb-1 group">
                <span className="text-xs text-journey-primary">●</span>
                <span className="text-sm flex-1 text-journey-text">{item}</span>
                <button type="button" onClick={() => removeItem(i)} className="text-xs text-journey-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">✕</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Attachments */}
        <div>
          <label className="text-xs font-bold text-journey-muted mb-1.5 block uppercase tracking-wider">
            Attachments {attachments.length > 0 && <span className="text-journey-primary">({attachments.length})</span>}
          </label>

          {/* Drop zone */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-journey-border rounded-xl p-5 text-center cursor-pointer hover:border-journey-primary/40 hover:bg-journey-surface/50 transition-all group"
          >
            <input ref={fileRef} type="file" multiple onChange={handleUpload} className="hidden" />
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{uploading ? '⏳' : '📎'}</div>
            <div className="text-xs text-journey-muted">{uploading ? 'Uploading...' : 'Click to attach files (images, PDFs, etc.)'}</div>
          </motion.div>

          {/* Preview */}
          <AnimatePresence>
            {attachments.map((att, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-3 px-3 py-2 mt-2 rounded-xl bg-journey-surface border border-journey-border group">
                {att.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <img src={att.url} alt="" className="w-8 h-8 rounded object-cover" />
                ) : (
                  <span className="text-sm">📄</span>
                )}
                <span className="text-xs text-journey-text flex-1 truncate">{att.name}</span>
                <button type="button" onClick={() => removeAttachment(i)}
                  className="text-xs text-journey-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">✕</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-6">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit"
          disabled={saving || !title.trim()}
          className="px-6 py-2.5 bg-gradient-to-r from-journey-primary to-indigo-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-journey-primary/30 disabled:opacity-50 transition-all">
          {saving ? 'Saving...' : 'Save Meeting'}
        </motion.button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 text-sm text-journey-muted hover:text-journey-text transition-colors font-medium">Cancel</button>
      </div>
    </motion.form>
  );
}
