'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Star, MapPin, Clock, Phone, Mail, Briefcase, Search } from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  experience: number;
  rating: number;
  location: string;
  phone: string;
  email: string;
  availability: string;
  bio: string;
  image: string;
}

const therapists: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Anxiety & Depression',
    credentials: 'PhD, Licensed Clinical Psychologist',
    experience: 12,
    rating: 4.8,
    location: 'New York, NY',
    phone: '(555) 123-4567',
    email: 'sarah.mitchell@therapy.com',
    availability: 'Mon-Fri, 9 AM - 6 PM',
    bio: 'Specializing in cognitive-behavioral therapy with a focus on anxiety disorders and depression treatment.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  },
  {
    id: '2',
    name: 'Dr. James Rodriguez',
    specialty: 'Trauma & PTSD',
    credentials: 'MD, Trauma-Focused Therapist',
    experience: 15,
    rating: 4.9,
    location: 'Los Angeles, CA',
    phone: '(555) 234-5678',
    email: 'james.rodriguez@therapy.com',
    availability: 'Flexible scheduling available',
    bio: 'Expert in trauma-informed care and PTSD recovery. Offering both individual and group sessions.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    specialty: 'Relationships & Stress',
    credentials: 'LMFT, Licensed Marriage and Family Therapist',
    experience: 10,
    rating: 4.7,
    location: 'Chicago, IL',
    phone: '(555) 345-6789',
    email: 'emily.chen@therapy.com',
    availability: 'Mon-Thu, 10 AM - 5 PM',
    bio: 'Helping individuals and couples navigate relationship challenges and manage stress effectively.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
  },
  {
    id: '4',
    name: 'Dr. Michael Park',
    specialty: 'Addiction & Recovery',
    credentials: 'LCSW, Addiction Specialist',
    experience: 20,
    rating: 4.9,
    location: 'Boston, MA',
    phone: '(555) 456-7890',
    email: 'michael.park@therapy.com',
    availability: 'Weekdays & Weekends',
    bio: 'Comprehensive addiction treatment and recovery support for individuals and families.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Self-Esteem & Identity',
    credentials: 'PhD, Existential Therapist',
    experience: 14,
    rating: 4.8,
    location: 'Seattle, WA',
    phone: '(555) 567-8901',
    email: 'lisa.thompson@therapy.com',
    availability: 'Flexible scheduling',
    bio: 'Specializing in identity exploration and building a stronger sense of self-worth.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
  },
  {
    id: '6',
    name: 'Dr. Robert Williams',
    specialty: 'Career & Life Transitions',
    credentials: 'PsyD, Life Coach Certified',
    experience: 18,
    rating: 4.7,
    location: 'Austin, TX',
    phone: '(555) 678-9012',
    email: 'robert.williams@therapy.com',
    availability: 'Mon-Fri, 8 AM - 7 PM',
    bio: 'Guiding clients through major life changes and career transitions with confidence.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  },
];

export default function TherapistView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTherapists = therapists.filter(
    therapist =>
      therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Find a Therapist</h1>
        <p className="text-muted-foreground mt-1">
          Connect with qualified mental health professionals
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, specialty, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-secondary/20 border-primary/20"
        />
      </div>

      {/* Info Banner */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <p className="text-sm text-foreground">
            <strong>Important:</strong> HealyMate provides therapist recommendations for informational purposes.
            Always verify credentials and verify that therapists are licensed to practice in your state.
          </p>
        </CardContent>
      </Card>

      {/* Therapists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTherapists.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No therapists found matching your search.</p>
          </div>
        ) : (
          filteredTherapists.map((therapist) => (
            <Card key={therapist.id} className="border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{therapist.name}</h3>
                    <p className="text-sm text-primary font-medium mt-1">{therapist.specialty}</p>
                    <p className="text-xs text-muted-foreground mt-1">{therapist.credentials}</p>
                  </div>

                  {/* Rating and Experience */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">{therapist.rating}</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {therapist.experience} years
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground line-clamp-2">{therapist.bio}</p>

                  {/* Details */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      {therapist.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      {therapist.availability}
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <a href={`mailto:${therapist.email}`} className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <a href={`tel:${therapist.phone}`} className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Resources Section */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Finding the Right Therapist</CardTitle>
          <CardDescription>Tips for selecting a therapist that works for you</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <p className="text-sm text-foreground">
                <strong>Verify Credentials:</strong> Ensure your therapist is licensed and qualified to treat your specific needs.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <p className="text-sm text-foreground">
                <strong>Consider Compatibility:</strong> The therapeutic relationship is crucial. Choose someone you feel comfortable talking to.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <p className="text-sm text-foreground">
                <strong>Check Insurance:</strong> Confirm that your therapist accepts your insurance or offer affordable rates.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <p className="text-sm text-foreground">
                <strong>Ask Questions:</strong> Don&apos;t hesitate to inquire about their approach, experience, and availability.
              </p>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Support Resources */}
      <Card className="border-primary/10 bg-gradient-to-r from-destructive/5 to-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">Crisis Support</CardTitle>
          <CardDescription>If you&apos;re in crisis, please reach out immediately</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <p className="font-medium text-foreground">National Suicide Prevention Lifeline</p>
            <p className="text-muted-foreground">1-800-273-8255 (Available 24/7)</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Crisis Text Line</p>
            <p className="text-muted-foreground">Text HOME to 741741</p>
          </div>
          <div>
            <p className="font-medium text-foreground">988 Suicide & Crisis Lifeline</p>
            <p className="text-muted-foreground">Call or text 988 (New)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
