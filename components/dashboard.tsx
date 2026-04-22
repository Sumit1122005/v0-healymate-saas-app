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
import SettingsView from './views/settings-view';

type ViewType = 'overview' | 'journal' | 'mood' | 'meditation' | 'goals' | 'therapist' | 'community' | 'resources' | 'settings';

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
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <DashboardNav activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto relative z-10">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
