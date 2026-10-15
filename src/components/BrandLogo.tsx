import React from 'react';

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export const BrandEmblem: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Kamai Saathi Emblem"
    >
      <defs>
        {/* Golden Gradient */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Emerald Green Gradient */}
        <linearGradient id="emeraldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>

        {/* Circular glow filter */}
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#D97706" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Dark Outer Shield Ring */}
      <circle cx="50" cy="50" r="47" fill="#0B132B" stroke="#334155" strokeWidth="1" />

      {/* Upward Growth Bars in Emerald Green */}
      <rect x="42" y="58" width="5.5" height="18" rx="2" fill="url(#emeraldGrad)" />
      <rect x="50" y="50" width="5.5" height="26" rx="2" fill="url(#emeraldGrad)" />
      <rect x="58" y="42" width="5.5" height="34" rx="2" fill="url(#emeraldGrad)" />
      <rect x="66" y="34" width="5.5" height="42" rx="2" fill="url(#emeraldGrad)" opacity="0.9" />

      {/* Outer Golden Sweeping Arc with Arrow */}
      <path
        d="M 32 24 A 42 42 0 1 1 76 68"
        stroke="url(#goldGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        filter="url(#softGlow)"
      />
      {/* Arrow tip at top-right of arc */}
      <polygon points="76,64 84,68 76,74" fill="url(#goldGrad)" />

      {/* Primary Figure (Golden Mentor / Saathi) */}
      <circle cx="44" cy="30" r="7.5" fill="url(#goldGrad)" />
      <path
        d="M 30 52 C 30 38 42 36 50 42 C 42 46 36 52 38 68 C 34 68 30 62 30 52 Z"
        fill="url(#goldGrad)"
      />

      {/* Secondary Figure (Emerald Earner / Kamai) */}
      <circle cx="57" cy="35" r="5.5" fill="url(#emeraldGrad)" />
      <path
        d="M 44 64 C 44 54 52 48 62 48 C 56 54 52 60 54 74 C 48 74 44 70 44 64 Z"
        fill="url(#emeraldGrad)"
      />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
  iconOnly = false,
}) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 34;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';
  const taglineSize = size === 'sm' ? 'text-[10px]' : 'text-xs';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <BrandEmblem size={iconSize} />
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <div className={`font-bold tracking-tight ${textSize} flex items-center`}>
            <span className="text-slate-900 dark:text-white">Kamai</span>
            <span className="text-amber-500 ml-1">Saathi</span>
          </div>
          {showTagline && (
            <span className={`${taglineSize} font-medium text-slate-500 dark:text-slate-400 tracking-normal`}>
              Money clarity. Safer choices.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
