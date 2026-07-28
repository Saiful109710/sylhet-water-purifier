import React from 'react';

interface SWPLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const SWPLogo: React.FC<SWPLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true
}) => {
  // Height and dimensions scaling
  const heightClass = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg 
        viewBox="0 0 450 160" 
        className={`${heightClass} w-auto drop-shadow-sm`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="swpCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="waterDropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          <linearGradient id="filterHousingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* SWP Outline Letters */}
        <g stroke="url(#swpCyanGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Letter S */}
          <path d="M 90 40 C 90 22, 35 22, 35 45 C 35 70, 90 60, 90 85 C 90 108, 30 108, 30 92" />
          
          {/* Letter W */}
          <path d="M 100 30 L 120 100 L 140 45 L 160 100 L 180 30" />
          
          {/* Letter P */}
          <path d="M 200 100 L 200 30 L 235 30 C 255 30, 255 65, 235 65 L 200 65" />
        </g>

        {/* Integrated Water Droplet on S */}
        <path 
          d="M 30 85 C 20 85, 12 93, 12 103 C 12 113, 20 120, 30 120 C 40 120, 48 113, 48 103 C 48 93, 30 85, 30 85 Z" 
          fill="url(#waterDropGrad)" 
          stroke="#0284c7" 
          strokeWidth="2.5" 
        />

        {/* Text: Sylhet Water Purifier */}
        <text 
          x="32" 
          y="118" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="26" 
          fill="#0284c7" 
          letterSpacing="-0.5"
        >
          Sylhet Water
        </text>

        <text 
          x="58" 
          y="146" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontWeight="900" 
          fontSize="30" 
          fill="#0369a1" 
          letterSpacing="-0.5"
        >
          Purifier
        </text>

        {/* Water Filter Assembly Line Illustration on the Right */}
        <g stroke="url(#filterHousingGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Filter Top Manifold Header */}
          <rect x="295" y="45" width="80" height="18" rx="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" />
          <path d="M 315 45 L 315 32 C 315 28, 355 28, 355 32 L 355 45" />
          <circle cx="335" cy="30" r="3" fill="#0284c7" />

          {/* Connectors & Pipes */}
          <path d="M 280 54 L 295 54" strokeWidth="3.5" />
          <path d="M 375 54 L 390 54 L 390 115 C 390 125, 270 125, 270 110 L 270 25" strokeWidth="3" />

          {/* Left Cartridge Housing */}
          <rect x="305" y="70" width="28" height="52" rx="10" fill="#f0f9ff" stroke="#0284c7" strokeWidth="3.5" />
          <line x1="305" y1="82" x2="333" y2="82" stroke="#38bdf8" strokeWidth="3" />
          <line x1="305" y1="94" x2="333" y2="94" stroke="#38bdf8" strokeWidth="3" />
          <line x1="305" y1="106" x2="333" y2="106" stroke="#38bdf8" strokeWidth="3" />

          {/* Right Cartridge Housing */}
          <rect x="342" y="70" width="28" height="52" rx="10" fill="#f0f9ff" stroke="#0284c7" strokeWidth="3.5" />
          <line x1="342" y1="82" x2="370" y2="82" stroke="#38bdf8" strokeWidth="3" />
          <line x1="342" y1="94" x2="370" y2="94" stroke="#38bdf8" strokeWidth="3" />
          <line x1="342" y1="106" x2="370" y2="106" stroke="#38bdf8" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
};
