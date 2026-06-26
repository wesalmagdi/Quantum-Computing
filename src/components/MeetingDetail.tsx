'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Meeting, Attachment } from '@/lib/data';

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MeetingDetail({ meeting, onBack, onDeleted }: {
  meeting: Meeting;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const [items, setItems] = useState(meeting.actionItems);
  const [attachments, setAttachments] = useState<Attachment[]>(meeting.attachments);
  const [newItemText, setNewItemText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveField = async (field: string, value: any) => {
    await fetch(`/api/meetings/${meeting.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
  };

  const toggleItem = async (idx: number) => {
    const updated = items.map((item, i) => i === idx ? { ...item, done: !item.done } : item);
    setItems(updated);
    await saveField('actionItems', updated);
  };

  const addNewItem = async () => {
    if (!newItemText.trim()) return;
    const updated = [...items, { text: newItemText.trim(), done: false }];
    setItems(updated);
    setNewItemText('');
    await saveField('actionItems', updated);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError('');
    const newAttachments: Attachment[] = [...attachments];
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await readFileAsDataURL(file);
        newAttachments.push({ url: dataUrl, name: file.name });
      } catch (err) {
        setUploadError(`Failed to read ${file.name}`);
        console.error(err);
      }
    }
    setAttachments(newAttachments);
    await saveField('attachments', newAttachments);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this research session?')) return;
    setDeleting(true);
    await fetch(`/api/meetings/${meeting.id}`, { method: 'DELETE' });
    onDeleted();
  };

  const doneCount = items.filter(i => i.done).length;
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-16">
      <motion.button
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
        onClick={onBack}
        className="flex items-center gap-2 text-[11px] font-mono text-journey-muted hover:text-journey-text mb-6 transition-colors"
      >
        <span>←</span>
        <span>Back to research log</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      >
        <div className="border border-journey-border/30 rounded-lg bg-journey-card/40 overflow-hidden">
          <div className="border-b border-journey-border/20 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[10px] font-mono text-journey-muted/50 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-journey-primary" style={{ boxShadow: '0 0 6px rgba(129,140,248,0.4)' }} />
                  <span className="uppercase tracking-wider">Research Session</span>
                  <span className="text-journey-border/30">/</span>
                  <span>{meeting.date}</span>
                </div>
                <h1 className="text-lg md:text-xl font-bold text-journey-text font-mono tracking-tight">
                  {meeting.title}
                </h1>
              </div>
              <button onClick={handleDelete} disabled={deleting}
                className="text-[10px] font-mono text-journey-muted/40 hover:text-rose-400 transition-colors shrink-0 px-2 py-1 rounded border border-transparent hover:border-rose-400/20">
                {deleting ? 'deleting...' : 'delete'}
              </button>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <div className="flex-1 h-1 bg-journey-surface rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-journey-primary to-journey-accent"
                    style={{ boxShadow: '0 0 8px rgba(129,140,248,0.3)' }}
                  />
                </div>
                <span className="text-[10px] font-mono text-journey-muted">{doneCount}/{items.length}</span>
              </div>
            )}
          </div>

          <div className="divide-y divide-journey-border/10">
            <Section icon="◇" title="Discussion Notes">
              <div className="bg-journey-surface/20 rounded p-3 border border-journey-border/10">
                <p className="text-sm text-journey-text/80 leading-relaxed whitespace-pre-wrap font-light">
                  {meeting.discussed}
                </p>
              </div>
            </Section>

            <Section icon="◆" title={`Action Items (${doneCount}/${items.length})`}>
              <div className="space-y-1">
                {items.map((item, i) => (
                  <motion.label key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-2 rounded hover:bg-journey-surface/20 cursor-pointer group transition-colors"
                  >
                    <div className="relative mt-0.5 shrink-0">
                      <input type="checkbox" checked={item.done} onChange={() => toggleItem(i)} className="peer sr-only" />
                      <div className="w-4 h-4 rounded border border-journey-border/40 peer-checked:border-journey-primary peer-checked:bg-journey-primary/20 transition-all flex items-center justify-center">
                        {item.done && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2 2 4-4" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs flex-1 ${item.done ? 'line-through text-journey-muted/50' : 'text-journey-text/80'}`}>
                      {item.text}
                    </span>
                  </motion.label>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-journey-border/10">
                <input type="text" value={newItemText} onChange={e => setNewItemText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNewItem(); } }}
                  placeholder="Add action item..." className="flex-1 px-2.5 py-1.5 text-xs font-mono bg-transparent border border-journey-border/20 rounded focus:outline-none focus:border-journey-primary/40 text-journey-text placeholder:text-journey-muted/30" />
                <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addNewItem}
                  className="px-2.5 py-1.5 text-[10px] font-mono border border-journey-primary/20 text-journey-primary rounded hover:bg-journey-primary/10 transition-colors">+ Add</motion.button>
              </div>
            </Section>

            <Section icon="◈" title={`Attachments (${attachments.length})`}>
              {attachments.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                  {attachments.map((att, i) => (
                    att.url.startsWith('data:image/') ? (
                      <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                        className="group relative rounded-lg overflow-hidden border border-journey-border/20 hover:border-journey-primary/30 transition-all aspect-square"
                      >
                        <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-2">
                          <span className="text-[9px] text-white/80 truncate font-mono">{att.name}</span>
                        </div>
                      </a>
                    ) : (
                      <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg border border-journey-border/20 bg-journey-surface/10 hover:bg-journey-surface/20 hover:border-journey-primary/20 transition-all group"
                      >
                        <span className="text-xs text-journey-muted/60">◇</span>
                        <span className="truncate text-[10px] font-mono text-journey-text/60 group-hover:text-journey-primary transition-colors">{att.name}</span>
                      </a>
                    )
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {uploadError && <div className="text-[9px] font-mono text-rose-400/70 mb-1.5">{uploadError}</div>}
                  <motion.div whileHover={{ scale: 1.01 }}
                    onClick={() => fileRef.current?.click()}
                    className="border border-dashed border-journey-border/20 rounded-lg p-3 text-center cursor-pointer hover:border-journey-primary/30 hover:bg-journey-surface/10 transition-all group"
                  >
                    <input ref={fileRef} type="file" multiple onChange={handleUpload} className="hidden" />
                    <div className="text-[10px] font-mono text-journey-muted/40 group-hover:text-journey-muted/60 transition-colors">
                      {uploading ? 'reading files...' : '+ attach files to this session'}
                    </div>
                  </motion.div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <h2 className="text-[10px] font-mono uppercase tracking-wider text-journey-muted/50 mb-3 flex items-center gap-2">
        <span className="text-journey-primary/60">{icon}</span>
        <span>{title}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-journey-border/20 to-transparent ml-2" />
      </h2>
      {children}
    </div>
  );
}
