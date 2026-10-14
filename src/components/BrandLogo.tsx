import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  light?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  light = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-10 h-10',
    md: 'w-13 h-13',
    lg: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`flex items-center gap-3.5 select-none group ${className}`}>
      {/* Professional Medical Trust Shield Emblem */}
      <div
        className={`${iconDimensions[size]} relative shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 p-[2px] shadow-lg shadow-teal-950/20 group-hover:shadow-teal-600/40 group-hover:scale-105 transition-all duration-300`}
      >
        <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-teal-900 via-slate-900 to-emerald-950 flex items-center justify-center p-2 relative overflow-hidden">
          {/* Subtle radial sheen glow */}
          <div className="absolute -top-4 -right-4 w-10 h-10 bg-emerald-400/30 rounded-full blur-xs pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-cyan-400/20 rounded-full blur-xs pointer-events-none" />

          <svg
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            {/* Outer Armor Shield */}
            <path
              d="M22 3L6 8.5V20.5C6 29.5 12.8 37.8 22 41C31.2 37.8 38 29.5 38 20.5V8.5L22 3Z"
              fill="url(#shieldGradFinal)"
              stroke="url(#shieldBorderFinal)"
              strokeWidth="1.5"
            />

            {/* Inner Glowing Ring */}
            <circle
              cx="22"
              cy="21"
              r="12.5"
              stroke="#5eead4"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.6"
            />

            {/* Healing Leaves / Lotus Petals of Life */}
            <path
              d="M22 10C22 10 14 16 14 22C14 26 17.5 29 22 29C26.5 29 30 26 30 22C30 16 22 10 22 10Z"
              fill="url(#innerLifeGrad)"
              opacity="0.9"
            />

            {/* Bold Golden/White Medical Cross */}
            <rect x="19.5" y="14" width="5" height="15" rx="2.5" fill="#ffffff" />
            <rect x="14.5" y="19" width="15" height="5" rx="2.5" fill="#ffffff" />

            {/* Center Core Spark of Vitality */}
            <circle cx="22" cy="21.5" r="2.2" fill="#0d9488" />

            {/* Gradients */}
            <defs>
              <linearGradient id="shieldGradFinal" x1="6" y1="3" x2="38" y2="41" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0f766e" />
                <stop offset="0.6" stopColor="#042f2e" />
                <stop offset="1" stopColor="#022c22" />
              </linearGradient>
              <linearGradient id="shieldBorderFinal" x1="6" y1="3" x2="38" y2="41" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5eead4" />
                <stop offset="0.5" stopColor="#34d399" />
                <stop offset="1" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="innerLifeGrad" x1="14" y1="10" x2="30" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Bold, Distinctive, Authoritative Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`${titleSizes[size]} font-black tracking-tight leading-none ${
              light
                ? 'text-white'
                : 'text-stone-950 group-hover:text-teal-900 transition-colors'
            }`}
          >
            हिंदी{' '}
            <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-900 bg-clip-text text-transparent font-black drop-shadow-xs">
              हेल्थ गाइड
            </span>
          </span>

          <span
            className={`hidden sm:inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full shadow-xs ${
              light
                ? 'bg-teal-900/90 text-emerald-300 border border-teal-600/60'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300/80'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            स्वास्थ्य साथी
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-[11px] sm:text-xs font-black tracking-[0.16em] uppercase ${
                light ? 'text-teal-300' : 'text-teal-800'
              }`}
            >
              HINDI HEALTH GUIDE
            </span>
            <span className={`text-[11px] font-semibold ${light ? 'text-stone-400' : 'text-stone-500'}`}>
              • भारत का प्रामाणिक यौन स्वास्थ्य पोर्टल
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
