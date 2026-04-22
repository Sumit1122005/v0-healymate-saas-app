'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ 
  className = '', 
  showText = true, 
  variant = 'light',
  size = 'md'
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  const { icon: iconSize, text: textSize } = sizeMap[size];
  const textColor = variant === 'dark' ? 'text-white' : 'text-foreground';
  const accentColor = 'text-primary';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Infinity Symbol Logo */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Left circle head */}
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="currentColor"
          className={accentColor}
        />
        {/* Right circle head */}
        <circle
          cx="36"
          cy="12"
          r="4"
          fill="currentColor"
          className={accentColor}
        />
        {/* Left infinity loop */}
        <path
          d="M 16 20 Q 16 28 12 28 Q 8 28 8 24 Q 8 20 12 20 Q 16 20 16 24"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={accentColor}
        />
        {/* Right infinity loop */}
        <path
          d="M 32 20 Q 32 28 36 28 Q 40 28 40 24 Q 40 20 36 20 Q 32 20 32 24"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={accentColor}
        />
        {/* Connecting bridge */}
        <path
          d="M 16 24 L 32 24"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={accentColor}
        />
      </svg>

      {showText && (
        <div className="flex flex-col -gap-1">
          <span className={`font-bold ${textSize} ${textColor} leading-none`}>
            HealyMate
          </span>
          <span className={`text-xs ${accentColor} font-medium leading-none`}>
            You&apos;re not alone.
          </span>
        </div>
      )}
    </div>
  );
}
