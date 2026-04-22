'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: 'HealyMate has been a game-changer for my mental health. The journaling feature with AI insights is incredibly powerful.',
    author: 'Sarah Chen',
    role: 'Product Manager',
    rating: 5,
  },
  {
    quote: 'I love how private and secure everything is. I can write freely knowing my entries are encrypted and safe.',
    author: 'Marcus Johnson',
    role: 'Software Engineer',
    rating: 5,
  },
  {
    quote: 'The meditation sessions help me start and end my day with calm. The community support is also amazing.',
    author: 'Emily Rodriguez',
    role: 'Yoga Instructor',
    rating: 5,
  },
  {
    quote: 'Finally found a place where I can track my mood and see real patterns. The data visualization is beautiful.',
    author: 'Alex Kim',
    role: 'Designer',
    rating: 5,
  },
  {
    quote: 'The combination of journaling, meditation, and therapy connection all in one app is brilliant. Highly recommend!',
    author: 'David Thompson',
    role: 'Therapist',
    rating: 5,
  },
  {
    quote: 'I appreciate the focus on privacy and security. HealyMate respects my data while providing genuine support.',
    author: 'Jessica White',
    role: 'Entrepreneur',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">Loved by Our Community</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Real stories from real users who have transformed their mental health journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group h-full border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all bg-gradient-to-br from-card to-card/50">
                <CardContent className="pt-6 space-y-4 h-full flex flex-col">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-foreground/80 flex-grow italic">"{testimonial.quote}"</p>

                  {/* Author */}
                  <div className="pt-4 border-t border-primary/10">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground/60">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
