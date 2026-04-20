'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { journalDB, JournalEntry } from '@/lib/db';
import { encryptData, decryptData } from '@/lib/encryption';
import { analyzeSentiment } from '@/lib/ai-service';
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
import { Plus, Search, Trash2, ChevronDown, Loader2 } from 'lucide-react';

export default function JournalView() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', mood: 3 });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadEntries = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await journalDB.getByUserId(user.id);
      setEntries(data.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  // Decrypt content when selected entry changes
  useEffect(() => {
    if (selectedEntry && user) {
      decryptEntry(selectedEntry).then(setDecryptedContent);
    }
  }, [selectedEntry, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title || !formData.content) return;

    setIsSaving(true);
    try {
      // Analyze sentiment
      const insight = await analyzeSentiment(formData.content);

      // Encrypt content
      const encryptedContent = await encryptData(formData.content, user.id);

      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        userId: user.id,
        title: formData.title,
        content: encryptedContent,
        mood: formData.mood,
        tags: [],
        sentiment: insight.sentiment,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await journalDB.create(entry);
      setFormData({ title: '', content: '', mood: 3 });
      setIsOpen(false);
      await loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await journalDB.delete(id);
      await loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const decryptEntry = async (entry: JournalEntry) => {
    try {
      if (!user) return '';
      return await decryptData(entry.content, user.id);
    } catch {
      return '[Unable to decrypt - entry may be corrupted]';
    }
  };

  const getMoodColor = (mood: number) => {
    switch (mood) {
      case 1:
        return 'text-red-500';
      case 2:
        return 'text-orange-500';
      case 3:
        return 'text-yellow-500';
      case 4:
        return 'text-lime-500';
      case 5:
        return 'text-green-500';
      default:
        return 'text-gray-500';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Journal</h1>
          <p className="text-muted-foreground mt-1">Reflect, explore, and grow through writing</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search entries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary/20 border-primary/20"
        />
      </div>

      {/* Entries List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <Card className="border-dashed border-primary/10">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">No entries yet. Start writing your first entry!</p>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              className="border-primary/10 hover:border-primary/20 cursor-pointer transition-colors"
              onClick={() => setSelectedEntry(entry)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{entry.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-sm font-medium ${getMoodColor(entry.mood)}`}>
                        {getMoodLabel(entry.mood)}
                      </span>
                      {entry.sentiment && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                          {entry.sentiment}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Entry Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Write a new entry</DialogTitle>
            <DialogDescription>Your journal entries are encrypted and stored securely</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Title</label>
              <Input
                placeholder="How are you feeling today?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Content</label>
              <Textarea
                placeholder="Write your thoughts, feelings, and reflections..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                disabled={isSaving}
                className="resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Current mood: {getMoodLabel(formData.mood)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: parseInt(e.target.value) })}
                disabled={isSaving}
                className="w-full"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title || !formData.content || isSaving}
                className="bg-primary hover:bg-primary/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Entry'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Entry Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEntry.title}</DialogTitle>
              <DialogDescription>
                {new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${getMoodColor(selectedEntry.mood)}`}>
                  {getMoodLabel(selectedEntry.mood)}
                </span>
                {selectedEntry.sentiment && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                    {selectedEntry.sentiment}
                  </span>
                )}
              </div>

              <div className="p-4 bg-secondary/20 rounded-lg border border-border">
                <p className="text-foreground whitespace-pre-wrap">{decryptedContent}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
