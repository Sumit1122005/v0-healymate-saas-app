'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for exploring your wellness journey',
    price: 'Free',
    features: [
      'AI-powered journaling',
      'Basic mood tracking',
      'Community access',
      '5 meditation sessions/month',
      'Email support',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    description: 'Recommended for consistent practitioners',
    price: '$9.99',
    period: '/month',
    features: [
      'Everything in Starter',
      'Unlimited meditation sessions',
      'Advanced mood analytics',
      'Therapist directory access',
      'Priority email support',
      'Goal tracking & reminders',
      'Download journal exports',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Wellness Plus',
    description: 'For serious wellness commitment',
    price: '$19.99',
    period: '/month',
    features: [
      'Everything in Pro',
      'Live therapy sessions',
      'Personal wellness coach',
      '1-on-1 guided meditation',
      'Phone support',
      'Custom wellness plan',
      'Integration with fitness apps',
    ],
    cta: 'Start Free Trial',
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose the plan that fits your wellness journey. Always free to start.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                className={`relative overflow-hidden h-full transition-all ${
                  plan.highlighted
                    ? 'border-primary/50 shadow-2xl ring-2 ring-primary/50 md:scale-105'
                    : 'border-primary/10 hover:border-primary/30 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                )}

                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-foreground/60">{plan.period}</span>}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className={`w-full h-11 font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90'
                        : 'border-primary/20 hover:bg-primary/10'
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    <Link href="/auth/signup">{plan.cta}</Link>
                  </Button>

                  {plan.price === 'Free' && (
                    <p className="text-xs text-foreground/60 text-center">No credit card required</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-foreground/70">
            All paid plans come with a 30-day money-back guarantee. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
