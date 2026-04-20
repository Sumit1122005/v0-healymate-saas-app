'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Play, Headphones, Heart, Brain, AlertCircle, Search } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'podcast' | 'tool';
  url: string;
  icon: React.ReactNode;
  author?: string;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to understanding anxiety disorders and coping strategies',
    category: 'Mental Health',
    type: 'article',
    url: '#',
    icon: <Brain className="w-6 h-6" />,
    author: 'Dr. Sarah Mitchell',
  },
  {
    id: '2',
    title: 'Mindfulness for Beginners',
    description: 'Learn the basics of mindfulness meditation and how it can improve your life',
    category: 'Meditation',
    type: 'video',
    url: '#',
    icon: <Play className="w-6 h-6" />,
  },
  {
    id: '3',
    title: 'The Anxiety Podcast',
    description: 'Weekly episodes discussing anxiety management, mental health, and wellness',
    category: 'Mental Health',
    type: 'podcast',
    url: '#',
    icon: <Headphones className="w-6 h-6" />,
  },
  {
    id: '4',
    title: 'Breathing Exercise Tool',
    description: 'Interactive guided breathing exercises for stress relief and relaxation',
    category: 'Stress Relief',
    type: 'tool',
    url: '#',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: '5',
    title: 'Sleep Hygiene Guide',
    description: 'Evidence-based tips for improving sleep quality and establishing healthy sleep habits',
    category: 'Sleep & Rest',
    type: 'article',
    url: '#',
    icon: <BookOpen className="w-6 h-6" />,
    author: 'Dr. Robert Williams',
  },
  {
    id: '6',
    title: 'Managing Depression',
    description: 'Strategies and resources for managing depression and finding support',
    category: 'Mental Health',
    type: 'article',
    url: '#',
    icon: <BookOpen className="w-6 h-6" />,
    author: 'Dr. Emily Chen',
  },
  {
    id: '7',
    title: 'Yoga for Mental Health',
    description: 'How yoga practices can support mental health and emotional well-being',
    category: 'Physical Wellness',
    type: 'video',
    url: '#',
    icon: <Play className="w-6 h-6" />,
  },
  {
    id: '8',
    title: 'Relationship Wellness Podcast',
    description: 'Insights on building healthy relationships and communication skills',
    category: 'Relationships',
    type: 'podcast',
    url: '#',
    icon: <Headphones className="w-6 h-6" />,
  },
  {
    id: '9',
    title: 'Mood Tracking Tool',
    description: 'Track your moods over time and identify patterns in your emotional well-being',
    category: 'Self-Care',
    type: 'tool',
    url: '#',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: '10',
    title: 'Cognitive Behavioral Therapy Basics',
    description: 'Learn about CBT techniques for managing negative thoughts and emotions',
    category: 'Mental Health',
    type: 'article',
    url: '#',
    icon: <BookOpen className="w-6 h-6" />,
  },
];

export default function ResourcesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['All', ...new Set(resources.map(r => r.category))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || selectedCategory === 'All' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return 'bg-blue-500/10 text-blue-700';
      case 'video':
        return 'bg-red-500/10 text-red-700';
      case 'podcast':
        return 'bg-purple-500/10 text-purple-700';
      case 'tool':
        return 'bg-green-500/10 text-green-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <BookOpen className="w-4 h-4" />;
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'podcast':
        return <Headphones className="w-4 h-4" />;
      case 'tool':
        return <Heart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Resources & Learning</h1>
        <p className="text-muted-foreground mt-1">Explore articles, videos, and tools for your wellness journey</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary/20 border-primary/20"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              (!selectedCategory && category === 'All') || selectedCategory === category
                ? 'bg-primary text-white shadow-md'
                : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="flex gap-4 pt-6">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">
            These resources are for educational purposes and should not replace professional medical advice.
            Always consult with qualified healthcare providers.
          </p>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No resources found matching your search.</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Icon and Type */}
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg">{resource.icon}</div>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getTypeColor(resource.type)}`}>
                      {getTypeIcon(resource.type)}
                      {resource.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{resource.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {resource.category}
                      </span>
                      {resource.author && (
                        <p className="text-xs text-muted-foreground">by {resource.author}</p>
                      )}
                    </div>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <a href={resource.url}>
                        Learn More
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Featured Resources */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle>Featured Learning Paths</CardTitle>
          <CardDescription>Curated collections to support your wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-semibold text-foreground mb-2">Getting Started</h4>
              <p className="text-sm text-muted-foreground mb-3">Essential resources for beginners</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Understanding Anxiety</li>
                <li>• Mindfulness Basics</li>
                <li>• Sleep Hygiene Guide</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-semibold text-foreground mb-2">Advanced Practices</h4>
              <p className="text-sm text-muted-foreground mb-3">Deepen your wellness practice</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• CBT Techniques</li>
                <li>• Yoga for Mental Health</li>
                <li>• Advanced Meditation</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-semibold text-foreground mb-2">Community Support</h4>
              <p className="text-sm text-muted-foreground mb-3">Connect and share with others</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Support Stories</li>
                <li>• Group Discussions</li>
                <li>• Wellness Challenges</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
