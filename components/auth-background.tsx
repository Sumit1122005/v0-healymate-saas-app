'use client';

export default function AuthBackground() {
  return (
    <>
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Logo watermark pattern */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-5">
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-cover" style={{ backgroundImage: 'url(/healymate-logo.png)' }} />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-cover" style={{ backgroundImage: 'url(/healymate-logo.png)' }} />
        <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-cover" style={{ backgroundImage: 'url(/healymate-logo.png)' }} />
      </div>
    </>
  );
}
