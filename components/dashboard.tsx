'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import DashboardNav from './dashboard-nav';
import JournalView from './views/journal-view';
import MoodTrackerView from './views/mood-tracker-view';
import MeditationView from './views/meditation-view';
import GoalsView from './views/goals-view';
import TherapistView from './views/therapist-view';
import CommunityView from './views/community-view';
import ResourcesView from './views/resources-view';
import DashboardOverview from './views/dashboard-overview';

type ViewType = 'overview' | 'journal' | 'mood' | 'meditation' | 'goals' | 'therapist' | 'community' | 'resources';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview />;
      case 'journal':
        return <JournalView />;
      case 'mood':
        return <MoodTrackerView />;
      case 'meditation':
        return <MeditationView />;
      case 'goals':
        return <GoalsView />;
      case 'therapist':
        return <TherapistView />;
      case 'community':
        return <CommunityView />;
      case 'resources':
        return <ResourcesView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardNav activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
