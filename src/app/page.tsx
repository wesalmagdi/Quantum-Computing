'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TopTabs from '@/components/TopTabs';
import TimelineView from '@/components/TimelineView';
import MeetingList from '@/components/MeetingList';
import StudyNotesView from '@/components/StudyNotesView';
import KnowledgeMap from '@/components/KnowledgeMap';
import AnimatedBackground from '@/components/AnimatedBackground';
import type { TabId } from '@/lib/data';

const variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const views: Record<string, React.ReactNode> = {
  overview: <TimelineView />,
  meetings: <MeetingList />,
  study: <StudyNotesView />,
  knowledge: <KnowledgeMap />,
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {views[activeTab]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
