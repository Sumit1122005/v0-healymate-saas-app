'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { journalDB, moodDB, meditationDB, goalDB, MoodEntry } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BookOpen, TrendingUp, Wind, Target, Heart } from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    journalEntries: 0,
    moodEntries: 0,
    meditationSessions: 0,
    completedGoals: 0,
  });
  const [moodData, setMoodData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const [journals, moods, meditations, goals] = await Promise.all([
          journalDB.getByUserId(user.id),
          moodDB.getByUserId(user.id),
          meditationDB.getByUserId(user.id),
          goalDB.getByUserId(user.id),
        ]);

        setStats({
          journalEntries: journals.length,
          moodEntries: moods.length,
          meditationSessions: meditations.filter(m => m.completed).length,
          completedGoals: goals.filter(g => g.progress === 100).length,
        });

        // Prepare mood chart data (last 7 days)
        const last7Days = moods
          .slice(-7)
          .map(m => ({
            date: new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mood: m.mood,
            intensity: m.intensity,
          }));

        setMoodData(last7Days);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  const statCards: StatCard[] = [
    {
      title: 'Journal Entries',
      value: stats.journalEntries,
      icon: <BookOpen className="w-5 h-5" />,
      color: 'from-primary/20 to-primary/5',
    },
    {
      title: 'Mood Tracked',
      value: stats.moodEntries,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-accent/20 to-accent/5',
    },
    {
      title: 'Meditations',
      value: stats.meditationSessions,
      icon: <Wind className="w-5 h-5" />,
      color: 'from-secondary/20 to-secondary/5',
    },
    {
      title: 'Goals Completed',
      value: stats.completedGoals,
      icon: <Target className="w-5 h-5" />,
      color: 'from-green-500/20 to-green-500/5',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your wellness journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-primary/10 hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-primary`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        {moodData.length > 0 && (
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Mood Trend</CardTitle>
              <CardDescription>Your mood over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--primary)' }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Quick Action Card */}
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              Wellness Tips
            </CardTitle>
            <CardDescription>Today&apos;s suggestions for your mental health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm font-medium text-foreground">Take a mindful moment</p>
                <p className="text-xs text-muted-foreground mt-1">Try a 5-minute breathing exercise to reset your mind</p>
              </div>
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                <p className="text-sm font-medium text-foreground">Reflect on your day</p>
                <p className="text-xs text-muted-foreground mt-1">Journal about one positive moment from today</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                <p className="text-sm font-medium text-foreground">Connect with others</p>
                <p className="text-xs text-muted-foreground mt-1">Visit the community to share or support others</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {stats.journalEntries === 0 && stats.moodEntries === 0 && (
        <Card className="border-primary/10 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Start your wellness journey</h3>
            <p className="text-sm text-muted-foreground">
              Begin by journaling your thoughts, tracking your mood, or starting a meditation session
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
