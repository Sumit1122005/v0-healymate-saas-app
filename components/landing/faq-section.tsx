'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is my data really private and encrypted?',
    answer:
      'Yes, absolutely. All journal entries and sensitive data are encrypted using military-grade AES-256-GCM encryption. Only you can decrypt your data with your password.',
  },
  {
    question: 'Do I need to pay to start using HealyMate?',
    answer:
      'No, our Starter plan is completely free. You get access to journaling, basic mood tracking, community features, and 5 meditation sessions per month at no cost.',
  },
  {
    question: 'Can I use HealyMate on mobile?',
    answer:
      'Currently, HealyMate is available as a web app that works great on mobile browsers. Native iOS and Android apps are coming soon.',
  },
  {
    question: 'How does the AI sentiment analysis work?',
    answer:
      'Our AI analyzes the emotional tone and themes in your journal entries to provide insights about your mood patterns and mental health trends. No data is sent to external servers.',
  },
  {
    question: 'Can I export my data?',
    answer:
      'Yes, on the Pro plan and above, you can download all your journal entries and data in JSON format anytime. You own your data.',
  },
  {
    question: 'Is HealyMate a replacement for therapy?',
    answer:
      'No, HealyMate is a wellness tool designed to complement professional mental health care, not replace it. We encourage you to work with qualified therapists for serious concerns.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express) and payment through PayPal. All payments are securely processed.',
  },
  {
    question: 'How often is the content updated?',
    answer:
      'Our meditation library and wellness resources are updated weekly with new content. Therapist directory is updated in real-time.',
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="border-b border-primary/10 last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-start justify-between gap-4 hover:text-primary transition-colors text-left group"
      >
        <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 text-foreground/60 group-hover:text-primary ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-foreground/70 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground/70">
            Find answers to common questions about HealyMate.
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-card to-card/50 border border-primary/10 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </motion.div>

        {/* Still have questions */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-foreground/70">
            Still have questions?{' '}
            <a href="mailto:support@healymate.com" className="text-primary hover:text-primary/80 font-semibold">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
