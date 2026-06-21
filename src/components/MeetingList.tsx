'use client';

import { useEffect, useState } from 'react';
import type { Meeting } from '@/lib/data';
import MeetingDetail from './MeetingDetail';
import MeetingForm from './MeetingForm';

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-journey-text">Meetings</h1>
          <p className="text-sm text-journey-muted mt-0.5">{meetings.length} meeting{meetings.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-journey-primary text-white text-sm font-medium rounded-lg hover:bg-journey-primary-dark transition-colors shadow-sm"
        >
          + New Meeting
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <MeetingForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        </div>
      )}

      <div className="space-y-3">
        {meetings.length === 0 && !showForm && (
          <div className="text-center py-12 text-journey-muted">
            <p className="text-lg mb-1">No meetings yet</p>
            <p className="text-sm">Click &quot;+ New Meeting&quot; to document your first session.</p>
          </div>
        )}

        {meetings.map(m => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            className="w-full text-left bg-white rounded-xl border border-journey-border p-4 hover:shadow-md transition-all hover:border-journey-primary/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-journey-text text-sm">{m.title}</h3>
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
          </button>
        ))}
      </div>
    </div>
  );
}
