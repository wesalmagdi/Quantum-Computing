'use client';

import { useState } from 'react';
import TopTabs from '@/components/TopTabs';
import TimelineView from '@/components/TimelineView';
import MeetingList from '@/components/MeetingList';
import StudyNotesView from '@/components/StudyNotesView';
import type { TabId } from '@/lib/data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="min-h-screen bg-journey-bg">
      <TopTabs active={activeTab} onSelect={setActiveTab} />

      {activeTab === 'overview' && <TimelineView />}
      {activeTab === 'meetings' && <MeetingList />}
      {activeTab === 'study' && <StudyNotesView />}
    </div>
  );
}
