'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const metrics = [
  { label: 'Active Users', value: 10000, suffix: '+' },
  { label: 'Journal Entries', value: 150000, suffix: '+' },
  { label: 'Mood Insights', value: 98, suffix: '%' },
  { label: 'User Satisfaction', value: 4.9, suffix: '/5' },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2;
    const increment = target / (duration * 60);

    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {typeof count === 'number' && count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function MetricsSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-bold">Trusted by Millions</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of users who have transformed their mental health journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center space-y-2 p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                <AnimatedCounter target={metric.value} suffix={metric.suffix} />
              </div>
              <p className="text-foreground/60 text-sm md:text-base">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
