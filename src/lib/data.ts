export interface ActionItem {
  text: string;
  done: boolean;
}

export interface Attachment {
  url: string;
  name: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  discussed: string;
  actionItems: ActionItem[];
  attachments: Attachment[];
}

export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'meeting' | 'study' | 'other';
}

export interface JourneyInfo {
  title: string;
  subtitle: string;
  team: string[];
  startDate: string;
  description: string;
}

export type TabId = 'overview' | 'meetings' | 'study';

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}
