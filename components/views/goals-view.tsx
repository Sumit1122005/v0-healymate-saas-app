'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { goalDB, Goal } from '@/lib/db';
import { generateGoalSuggestion } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Trash2, CheckCircle2, Circle, Lightbulb, Loader2 } from 'lucide-react';

interface GoalCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const categories: GoalCategory[] = [
  { id: 'health', label: 'Health & Fitness', icon: <Circle className="w-5 h-5" />, color: 'from-green-500/20 to-green-500/5' },
  { id: 'career', label: 'Career', icon: <Circle className="w-5 h-5" />, color: 'from-blue-500/20 to-blue-500/5' },
  { id: 'relationship', label: 'Relationships', icon: <Circle className="w-5 h-5" />, color: 'from-pink-500/20 to-pink-500/5' },
  { id: 'personal', label: 'Personal Growth', icon: <Circle className="w-5 h-5" />, color: 'from-purple-500/20 to-purple-500/5' },
  { id: 'other', label: 'Other', icon: <Circle className="w-5 h-5" />, color: 'from-gray-500/20 to-gray-500/5' },
];

export default function GoalsView() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
  });

  const loadGoals = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await goalDB.getByUserId(user.id);
      setGoals(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title) return;

    try {
      const goal: Goal = {
        id: crypto.randomUUID(),
        userId: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        progress: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await goalDB.create(goal);
      setFormData({ title: '', description: '', category: 'personal' });
      setIsOpen(false);
      await loadGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleUpdateProgress = async (goal: Goal, newProgress: number) => {
    try {
      const updated: Goal = {
        ...goal,
        progress: Math.min(100, Math.max(0, newProgress)),
        updatedAt: Date.now(),
      };
      await goalDB.update(updated);
      await loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await goalDB.delete(id);
      await loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const loadSuggestion = async () => {
    setIsLoadingSuggestion(true);
    try {
      const sugg = await generateGoalSuggestion();
      setSuggestion(sugg);
    } catch (error) {
      console.error('Error loading suggestion:', error);
    } finally {
      setIsLoadingSuggestion(false);
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'from-gray-500/20 to-gray-500/5';
  };

  const getCategoryLabel = (category: Goal['category']) => {
    const cat = categories.find(c => c.id === category);
    return cat?.label || 'Other';
  };

  const completedCount = goals.filter(g => g.progress === 100).length;
  const inProgressCount = goals.filter(g => g.progress > 0 && g.progress < 100).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Goals</h1>
          <p className="text-muted-foreground mt-1">Set and achieve meaningful objectives</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Goals</p>
            <p className="text-3xl font-bold text-primary mt-2">{goals.length}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-accent mt-2">{inProgressCount}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-green-500 mt-2">{completedCount}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/10">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-3xl font-bold text-primary mt-2">
              {goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suggestion Card */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <CardTitle>Goal Suggestion</CardTitle>
            </div>
            <Button
              onClick={loadSuggestion}
              disabled={isLoadingSuggestion}
              variant="outline"
              size="sm"
            >
              {isLoadingSuggestion ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  Loading...
                </>
              ) : (
                'New Suggestion'
              )}
            </Button>
          </div>
        </CardHeader>
        {suggestion && (
          <CardContent>
            <p className="text-sm text-foreground">{suggestion}</p>
          </CardContent>
        )}
      </Card>

      {/* Goals List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : goals.length === 0 ? (
          <Card className="border-dashed border-primary/10">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">No goals yet. Create your first goal!</p>
            </CardContent>
          </Card>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getCategoryColor(goal.category)} text-foreground`}>
                        {getCategoryLabel(goal.category)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(goal.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">Progress</p>
                      <p className="text-sm font-bold text-primary">{goal.progress}%</p>
                    </div>
                    <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Progress Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateProgress(goal, goal.progress - 10)}
                      disabled={goal.progress === 0}
                    >
                      −
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => handleUpdateProgress(goal, parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateProgress(goal, goal.progress + 10)}
                      disabled={goal.progress === 100}
                    >
                      +
                    </Button>
                    {goal.progress === 100 && (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-xs font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Goal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a new goal</DialogTitle>
            <DialogDescription>Set a meaningful objective and track your progress</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Goal Title</label>
              <Input
                placeholder="e.g., Run a 5K, Learn Spanish, Read 12 books"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Description</label>
              <Textarea
                placeholder="Why is this goal important to you? What will it take to achieve it?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id as Goal['category'] })}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.category === cat.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{cat.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title}
                className="bg-primary hover:bg-primary/90"
              >
                Create Goal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
