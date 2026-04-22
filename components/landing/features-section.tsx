'use client';

import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Wind, Target, Users, MessageCircle, Zap, Lock } from 'lucide-react';

const features = [
  {
    title: 'AI Journal',
    description: 'Write freely with AI-powered sentiment analysis and personalized insights.',
    icon: BookOpen,
    color: 'from-primary',
    span: 'md:col-span-2',
  },
  {
    title: 'Mood Tracking',
    description: 'Visual charts and trend analysis to understand your emotional patterns.',
    icon: TrendingUp,
    color: 'from-accent',
    span: '',
  },
  {
    title: 'Meditation',
    description: 'Guided sessions for any mood, with timer and category selection.',
    icon: Wind,
    color: 'from-secondary',
    span: '',
  },
  {
    title: 'Goal Setting',
    description: 'Set and track wellness goals with progress visualization.',
    icon: Target,
    color: 'from-primary',
    span: '',
  },
  {
    title: 'Therapist Network',
    description: 'Connect with verified mental health professionals.',
    icon: Users,
    color: 'from-accent',
    span: '',
  },
  {
    title: 'Community',
    description: 'Share experiences anonymously in a supportive community.',
    icon: MessageCircle,
    color: 'from-secondary',
    span: 'md:col-span-2',
  },
  {
    title: 'End-to-End Encrypted',
    description: 'Your data is protected with military-grade encryption.',
    icon: Lock,
    color: 'from-primary',
    span: '',
  },
  {
    title: 'Always Learning',
    description: 'Access curated wellness resources and educational content.',
    icon: Zap,
    color: 'from-accent',
    span: '',
  },
];

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">Powerful Features</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Everything you need to support your mental health journey in one beautifully designed app.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`group relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-card/50 p-8 hover:border-primary/30 transition-all ${feature.span}`}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-5`} />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} to-transparent/50 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/50 transition-all`}>
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-foreground/60 text-sm mt-2">{feature.description}</p>
                  </div>
                </div>

                {/* Hover accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
