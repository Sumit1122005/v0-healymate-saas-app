'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import {
  Home,
  BookOpen,
  TrendingUp,
  Wind,
  Target,
  Users,
  MessageCircle,
  Library,
  LogOut,
  Menu,
  X,
  Settings,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  view: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: <Home className="w-5 h-5" />, view: 'overview' },
  { id: 'journal', label: 'Journal', icon: <BookOpen className="w-5 h-5" />, view: 'journal' },
  { id: 'mood', label: 'Mood Tracker', icon: <TrendingUp className="w-5 h-5" />, view: 'mood' },
  { id: 'meditation', label: 'Meditation', icon: <Wind className="w-5 h-5" />, view: 'meditation' },
  { id: 'goals', label: 'Goals', icon: <Target className="w-5 h-5" />, view: 'goals' },
  { id: 'therapist', label: 'Therapists', icon: <Users className="w-5 h-5" />, view: 'therapist' },
  { id: 'community', label: 'Community', icon: <MessageCircle className="w-5 h-5" />, view: 'community' },
  { id: 'resources', label: 'Resources', icon: <Library className="w-5 h-5" />, view: 'resources' },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, view: 'settings' },
];

interface DashboardNavProps {
  activeView: string;
  onViewChange: (view: any) => void;
}

export default function DashboardNav({ activeView, onViewChange }: DashboardNavProps) {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background border-primary/20"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-30 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">HM</span>
            </div>
            <div>
              <h1 className="font-bold text-foreground">HealyMate</h1>
              <p className="text-xs text-muted-foreground">Wellness Companion</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onViewChange(item.view);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeView === item.view
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground hover:bg-secondary/50'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-border hover:bg-secondary/50"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <div className="pt-2 space-y-1">
            <p className="text-xs text-muted-foreground px-2">Logged in as</p>
            <p className="text-sm font-medium text-foreground px-2 truncate">{user?.email}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full justify-start gap-2 bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
