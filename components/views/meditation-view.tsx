'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { meditationDB, Meditation } from '@/lib/db';
import { generateMeditationRecommendation } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Wind, Loader2 } from 'lucide-react';

interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  category: string;
  icon: React.ReactNode;
  description: string;
}

const meditationSessions: MeditationSession[] = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    duration: 5,
    category: 'mindfulness',
    icon: <Wind className="w-6 h-6" />,
    description: 'Start your day with clarity and intention',
  },
  {
    id: '2',
    title: 'Breathing Exercise',
    duration: 3,
    category: 'breathing',
    icon: <Wind className="w-6 h-6" />,
    description: 'Calm your nervous system with guided breathing',
  },
  {
    id: '3',
    title: 'Body Scan Relaxation',
    duration: 10,
    category: 'body-scan',
    icon: <Wind className="w-6 h-6" />,
    description: 'Release tension and find deep relaxation',
  },
  {
    id: '4',
    title: 'Sleep Meditation',
    duration: 15,
    category: 'sleep',
    icon: <Wind className="w-6 h-6" />,
    description: 'Drift into peaceful sleep with gentle guidance',
  },
  {
    id: '5',
    title: 'Visualization Journey',
    duration: 8,
    category: 'visualization',
    icon: <Wind className="w-6 h-6" />,
    description: 'Visualize your ideal future and manifest peace',
  },
  {
    id: '6',
    title: 'Evening Reflection',
    duration: 7,
    category: 'mindfulness',
    icon: <Wind className="w-6 h-6" />,
    description: 'Reflect on your day with gratitude and presence',
  },
];

export default function MeditationView() {
  const { user } = useAuth();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedTime, setRecommendedTime] = useState('');

  const loadMeditations = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await meditationDB.getByUserId(user.id);
      setMeditations(data);
    } catch (error) {
      console.error('Error loading meditations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMeditations();
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && selectedSession) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= selectedSession.duration * 60) {
            completeSession();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, selectedSession]);

  const startSession = async (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeElapsed(0);
    setIsPlaying(true);

    // Get recommendation
    const recommendation = await generateMeditationRecommendation(3);
    setRecommendedTime(recommendation);
  };

  const completeSession = async () => {
    if (!user || !selectedSession) return;

    setIsSaving(true);
    try {
      const meditation: Meditation = {
        id: crypto.randomUUID(),
        userId: user.id,
        title: selectedSession.title,
        duration: selectedSession.duration,
        category: selectedSession.category as any,
        completed: true,
        completedAt: Date.now(),
        createdAt: Date.now(),
      };

      await meditationDB.create(meditation);
      await loadMeditations();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error completing meditation:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedCount = meditations.filter(m => m.completed).length;
  const totalMinutes = meditations.reduce((sum, m) => sum + m.duration, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Meditation & Mindfulness</h1>
        <p className="text-muted-foreground mt-1">Cultivate inner peace with guided meditation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold text-primary mt-1">{completedCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Minutes</p>
                <p className="text-2xl font-bold text-accent mt-1">{totalMinutes}</p>
              </div>
              <Clock className="w-8 h-8 text-accent opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Session */}
      {selectedSession && (
        <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-6">
              {/* Title */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedSession.title}</h2>
                <p className="text-muted-foreground mt-1">{selectedSession.description}</p>
              </div>

              {/* Timer */}
              <div className="flex justify-center">
                <div className="text-6xl font-mono font-bold text-primary">
                  {formatTime(timeElapsed)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: `${(timeElapsed / (selectedSession.duration * 60)) * 100}%`,
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  disabled={isSaving}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Resume
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => {
                    setTimeElapsed(0);
                    setIsPlaying(false);
                  }}
                  disabled={isSaving}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>

                <Button
                  onClick={completeSession}
                  disabled={isSaving || timeElapsed === 0}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Complete
                    </>
                  )}
                </Button>
              </div>

              {/* Recommendation */}
              {recommendedTime && (
                <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Tip for today</p>
                  <p className="text-sm text-foreground">{recommendedTime}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Sessions */}
      {!selectedSession && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Choose a meditation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meditationSessions.map((session) => (
              <Card
                key={session.id}
                className="border-primary/10 hover:border-primary/30 cursor-pointer transition-all hover:shadow-md"
                onClick={() => startSession(session)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">{session.icon}</div>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                      {session.duration} min
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{session.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{session.description}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      startSession(session);
                    }}
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      {meditations.length > 0 && !selectedSession && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your meditation history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {meditations
                .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
                .slice(0, 5)
                .map((meditation) => (
                  <div
                    key={meditation.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">{meditation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {meditation.completedAt
                            ? new Date(meditation.completedAt).toLocaleDateString()
                            : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{meditation.duration} min</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
