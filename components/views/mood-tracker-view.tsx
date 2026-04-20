'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { moodDB, MoodEntry } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Smile, Loader2 } from 'lucide-react';

interface MoodStats {
  average: number;
  highest: number;
  lowest: number;
  total: number;
}

export default function MoodTrackerView() {
  const { user } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<MoodStats>({
    average: 0,
    highest: 0,
    lowest: 0,
    total: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);

  const loadMoods = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await moodDB.getByUserId(user.id);
      setMoodEntries(data.sort((a, b) => b.timestamp - a.timestamp));

      if (data.length > 0) {
        const moods = data.map(m => m.mood);
        const average = Math.round(moods.reduce((a, b) => a + b, 0) / moods.length * 10) / 10;
        const highest = Math.max(...moods);
        const lowest = Math.min(...moods);

        setStats({
          average,
          highest,
          lowest,
          total: moods.length,
        });

        // Prepare last 7 days data
        const last7Days = data
          .slice(-7)
          .map(m => ({
            date: new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mood: m.mood,
            intensity: m.intensity,
          }))
          .reverse();

        setChartData(last7Days);
      }
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMoods();
  }, [user]);

  const handleMoodClick = async (mood: number) => {
    if (!user) return;
    setSelectedMood(mood);
    setIsSaving(true);

    try {
      const entry: MoodEntry = {
        id: crypto.randomUUID(),
        userId: user.id,
        mood,
        intensity: mood * 2, // Simple intensity calculation
        timestamp: Date.now(),
      };

      await moodDB.create(entry);
      await loadMoods();
      setSelectedMood(null);
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getMoodEmoji = (mood: number) => {
    switch (mood) {
      case 1:
        return '😢';
      case 2:
        return '😔';
      case 3:
        return '😐';
      case 4:
        return '😊';
      case 5:
        return '😄';
      default:
        return '❓';
    }
  };

  const getMoodLabel = (mood: number) => {
    switch (mood) {
      case 1:
        return 'Very sad';
      case 2:
        return 'Sad';
      case 3:
        return 'Okay';
      case 4:
        return 'Good';
      case 5:
        return 'Excellent';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mood Tracker</h1>
        <p className="text-muted-foreground mt-1">Track your emotional well-being throughout the day</p>
      </div>

      {/* Quick Mood Selection */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>How are you feeling right now?</CardTitle>
          <CardDescription>Click to log your current mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between gap-3">
            {[1, 2, 3, 4, 5].map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodClick(mood)}
                disabled={isSaving || selectedMood !== null}
                className={`flex-1 py-6 rounded-lg border-2 transition-all ${
                  selectedMood === mood
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="text-4xl mb-2">{getMoodEmoji(mood)}</div>
                <div className="text-xs font-medium text-foreground">{getMoodLabel(mood)}</div>
              </button>
            ))}
          </div>

          {isSaving && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Average Mood</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.average}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Highest</p>
              <p className="text-3xl font-bold text-green-500 mt-2">{stats.highest}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Lowest</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">{stats.lowest}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Logged</p>
              <p className="text-3xl font-bold text-primary mt-2">{stats.total}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Mood Trend</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" domain={[0, 5]} />
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Intensity Distribution</CardTitle>
              <CardDescription>How intense were your emotions?</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
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
                  <Bar
                    dataKey="intensity"
                    fill="var(--accent)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Recent Mood Logs</CardTitle>
            <CardDescription>Your mood history</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {moodEntries.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <p className="font-medium text-foreground">{getMoodLabel(entry.mood)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Intensity</p>
                      <p className="font-bold text-primary">{entry.intensity}/10</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {moodEntries.length === 0 && !isLoading && (
        <Card className="border-dashed border-primary/10">
          <CardContent className="pt-12 pb-12 text-center">
            <Smile className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Start tracking your mood</h3>
            <p className="text-sm text-muted-foreground">
              Select your current mood above to begin tracking your emotional well-being
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
