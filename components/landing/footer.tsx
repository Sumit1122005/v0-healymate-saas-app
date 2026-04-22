'use client';

import Link from 'next/link';
import Logo from '@/components/ui/logo';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-primary/10 bg-gradient-to-b from-transparent to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="group">
              <Logo variant="light" size="md" showText={true} className="group-hover:opacity-80 transition-opacity" />
            </Link>
            <p className="text-foreground/60 text-sm">
              AI-powered. Human-centered. Always with you.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><Link href="/auth/signup" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/Sumit1122005" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/sumit1122005" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-primary transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:sumit1122005@gmail.com" className="text-foreground/60 hover:text-primary transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
            <p>© {currentYear} HealyMate. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Status</a>
              <a href="#" className="hover:text-primary transition-colors">Blog</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
