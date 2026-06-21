'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopTabs from '@/components/TopTabs';
import TimelineView from '@/components/TimelineView';
import MeetingList from '@/components/MeetingList';
import StudyNotesView from '@/components/StudyNotesView';
import AnimatedBackground from '@/components/AnimatedBackground';
import type { TabId } from '@/lib/data';

const variants = {
  enter: { opacity: 0, y: 20, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

const views: Record<TabId, React.ReactNode> = {
  overview: <TimelineView />,
  meetings: <MeetingList />,
  study: <StudyNotesView />,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="min-h-screen bg-journey-bg relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <TopTabs active={activeTab} onSelect={setActiveTab} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {views[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
