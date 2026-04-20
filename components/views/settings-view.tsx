'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect, useState } from 'react';
import { userDB, User } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Heart, Shield, Bell } from 'lucide-react';
import { useEncryptedData } from '@/hooks/use-encrypted-data';

interface UserPreferences {
  emailNotifications: boolean;
  reminderNotifications: boolean;
  dailyInsights: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export default function SettingsView() {
  const { user, logout } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    reminderNotifications: true,
    dailyInsights: true,
    theme: 'auto',
    language: 'en',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      const dbUser = await userDB.getById(user.id);
      if (dbUser) {
        setUserData(dbUser);
      }
    };
    loadUserData();
  }, [user]);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would save to backend
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      setSaveMessage('Preferences saved successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout? Your data will be preserved locally.')) {
      await logout();
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData && (
            <>
              <div>
                <label className="text-sm font-medium text-foreground/70">Email Address</label>
                <Input
                  type="email"
                  value={userData.email}
                  disabled
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your email address is used for authentication and notifications.
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/70">Member Since</label>
                <p className="mt-1 text-foreground">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage how we communicate with you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Email Notifications</label>
              <p className="text-sm text-muted-foreground">Receive email updates about your wellness journey</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, emailNotifications: checked })
              }
            />
          </div>

          <div className="border-t border-border pt-4" />

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Reminder Notifications</label>
              <p className="text-sm text-muted-foreground">Get reminders for journaling and meditation</p>
            </div>
            <Switch
              checked={preferences.reminderNotifications}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, reminderNotifications: checked })
              }
            />
          </div>

          <div className="border-t border-border pt-4" />

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-foreground">Daily Insights</label>
              <p className="text-sm text-muted-foreground">Receive personalized daily wellness insights</p>
            </div>
            <Switch
              checked={preferences.dailyInsights}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, dailyInsights: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>Control your data and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">End-to-End Encrypted</p>
              <p className="text-muted-foreground">
                All your journal entries and personal data are encrypted with your password. Only you can read your data.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-foreground mb-3">Data Management</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your data is stored locally on your device. No information is sent to external servers unless explicitly enabled.
              </p>
              <Button
                variant="outline"
                className="w-full"
                disabled
              >
                Download Your Data
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
                disabled
              >
                Delete All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>Customize how HealyMate appears to you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/70">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) =>
                setPreferences({ ...preferences, theme: e.target.value as 'light' | 'dark' | 'auto' })
              }
              className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (Follow System)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/70">Language</label>
            <select
              value={preferences.language}
              onChange={(e) =>
                setPreferences({ ...preferences, language: e.target.value })
              }
              className="mt-2 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <Button
            onClick={handleSavePreferences}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>

          {saveMessage && (
            <p className="text-sm text-primary text-center">{saveMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* Logout Section */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Account Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
          >
            Logout
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can login again anytime with your email and password. Your data is stored locally and will be preserved.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
