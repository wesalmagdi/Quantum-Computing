'use client';

import { useState } from 'react';
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

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-journey-muted hover:text-journey-text mb-4 transition-colors">
        <span>{'\u2190'}</span> Back to meetings
      </button>

      <div className="bg-journey-card rounded-xl border border-journey-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-journey-border-light">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-journey-text">{meeting.title}</h1>
              <p className="text-sm text-journey-muted mt-1">{meeting.date}</p>
            </div>
            <button onClick={handleDelete} disabled={deleting} className="text-xs text-red-400 hover:text-red-600 transition-colors shrink-0">
              Delete
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-journey-muted mb-2">What was discussed</h2>
            <p className="text-sm text-journey-text leading-relaxed whitespace-pre-wrap">{meeting.discussed}</p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-wider font-semibold text-journey-muted mb-2">
              Action Items ({items.filter(i => i.done).length}/{items.length})
            </h2>
            <div className="space-y-1.5">
              {items.map((item, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(i)}
                    className="mt-0.5 rounded border-journey-border text-journey-primary focus:ring-journey-primary/30"
                  />
                  <span className={`text-sm ${item.done ? 'line-through text-journey-muted' : 'text-journey-text'}`}>
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {meeting.attachments.length > 0 && (
            <div>
              <h2 className="text-xs uppercase tracking-wider font-semibold text-journey-muted mb-2">Attachments</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {meeting.attachments.map((att, i) => (
                  <a
                    key={i}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-journey-border bg-journey-surface hover:bg-journey-border-light transition-colors text-sm text-journey-text"
                  >
                    <span className="text-journey-muted text-xs">{'\u{1F4CE}'}</span>
                    <span className="truncate text-xs">{att.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
