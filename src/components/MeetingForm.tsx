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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      onSubmit={handleSubmit}
      className="border border-journey-border/30 rounded-lg bg-journey-card/40 p-5 mb-6"
    >
      {/* Form header */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-journey-muted/50 mb-4 pb-3 border-b border-journey-border/10">
        <span className="w-1.5 h-1.5 rounded-full bg-journey-accent" style={{ boxShadow: '0 0 6px rgba(34,211,238,0.4)' }} />
        <span className="uppercase tracking-wider">New Research Session</span>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-[10px] font-mono text-journey-muted/60 uppercase tracking-wider mb-1.5 block">Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Sprint Planning — Week 5"
            className="w-full px-3 py-2 text-sm font-mono bg-transparent border border-journey-border/20 rounded focus:outline-none focus:border-journey-primary/40 text-journey-text placeholder:text-journey-muted/20 transition-all" required />
        </div>

        {/* Date */}
        <div>
          <label className="text-[10px] font-mono text-journey-muted/60 uppercase tracking-wider mb-1.5 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono bg-transparent border border-journey-border/20 rounded focus:outline-none focus:border-journey-primary/40 text-journey-text transition-all" required />
        </div>

        {/* Discussion */}
        <div>
          <label className="text-[10px] font-mono text-journey-muted/60 uppercase tracking-wider mb-1.5 block">Discussion Notes</label>
          <textarea value={discussed} onChange={e => setDiscussed(e.target.value)} rows={4}
            placeholder="Notes from the session..."
            className="w-full px-3 py-2 text-sm font-mono bg-transparent border border-journey-border/20 rounded focus:outline-none focus:border-journey-primary/40 text-journey-text placeholder:text-journey-muted/20 resize-y transition-all" />
        </div>

        {/* Action Items */}
        <div>
          <label className="text-[10px] font-mono text-journey-muted/60 uppercase tracking-wider mb-1.5 block">
            Action Items {actionItems.length > 0 && <span className="text-journey-primary/60">({actionItems.length})</span>}
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input type="text" value={newItem} onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
              placeholder="Add an action item..."
              className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-transparent border border-journey-border/20 rounded focus:outline-none focus:border-journey-primary/40 text-journey-text placeholder:text-journey-muted/20" />
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addItem}
              className="px-2.5 py-1.5 text-[10px] font-mono border border-journey-border/20 text-journey-muted rounded hover:text-journey-text hover:border-journey-text/30 transition-colors shrink-0">
              + Add
            </motion.button>
          </div>
          <AnimatePresence>
            {actionItems.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-journey-surface/10 mb-1 group">
                <span className="text-[9px] text-journey-primary/60">◆</span>
                <span className="text-xs flex-1 text-journey-text/80">{item}</span>
                <button type="button" onClick={() => removeItem(i)}
                  className="text-[9px] text-journey-muted/30 hover:text-rose-400/60 opacity-0 group-hover:opacity-100 transition-all">✕</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Attachments */}
        <div>
          <label className="text-[10px] font-mono text-journey-muted/60 uppercase tracking-wider mb-1.5 block">
            Attachments {attachments.length > 0 && <span className="text-journey-primary/60">({attachments.length})</span>}
          </label>
          <motion.div whileHover={{ scale: 1.01 }}
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-journey-border/20 rounded-lg p-4 text-center cursor-pointer hover:border-journey-primary/30 hover:bg-journey-surface/10 transition-all group"
          >
            <input ref={fileRef} type="file" multiple onChange={handleUpload} className="hidden" />
            <div className="text-[10px] font-mono text-journey-muted/30 group-hover:text-journey-muted/50 transition-colors">
              {uploading ? 'uploading...' : '+ click to attach files'}
            </div>
          </motion.div>
          <AnimatePresence>
            {attachments.map((att, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-2 px-2.5 py-1.5 mt-1.5 rounded bg-journey-surface/10 border border-journey-border/10 group">
                {att.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                  <img src={att.url} alt="" className="w-6 h-6 rounded object-cover" />
                ) : (
                  <span className="text-[10px] text-journey-muted/60">◇</span>
                )}
                <span className="text-[10px] font-mono text-journey-text/60 flex-1 truncate">{att.name}</span>
                <button type="button" onClick={() => removeAttachment(i)}
                  className="text-[9px] text-journey-muted/30 hover:text-rose-400/60 opacity-0 group-hover:opacity-100 transition-all">✕</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-journey-border/10">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
          disabled={saving || !title.trim()}
          className="px-4 py-2 text-xs font-mono font-bold rounded-lg border border-journey-primary/30 bg-journey-primary/10 text-journey-primary hover:bg-journey-primary/20 disabled:opacity-30 transition-all">
          {saving ? 'Saving...' : 'Publish Session'}
        </motion.button>
        <button type="button" onClick={onCancel}
          className="px-3 py-2 text-xs font-mono text-journey-muted/50 hover:text-journey-text/70 transition-colors">
          Cancel
        </button>
      </div>
    </motion.form>
  );
}
