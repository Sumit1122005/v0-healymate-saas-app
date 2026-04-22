'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import LandingNavbar from './navbar';
import HeroSection from './hero-section';
import FeaturesSection from './features-section';
import MetricsSection from './metrics-section';
import TestimonialsSection from './testimonials-section';
import PricingSection from './pricing-section';
import FAQSection from './faq-section';
import CTASection from './cta-section';
import Footer from './footer';

export default function LandingPage() {
  useEffect(() => {
    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <MetricsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
