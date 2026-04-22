'use client';

import AuthBackground from '@/components/auth-background';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AuthBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
