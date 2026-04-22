'use client';

import AuthForm from '@/components/auth-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
