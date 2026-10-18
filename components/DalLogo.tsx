'use client';

import React from 'react';
import { useTheme } from './ThemeContext';

interface DalLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  circular?: boolean;
  lightMode?: boolean;
  themeVariant?: 'new-emerald' | 'classic-dark';
}

export function DalLogo({
  className = '',
  size = 'md',
  showText = true,
  circular = true,
  lightMode = false,
  themeVariant,
}: DalLogoProps) {
  const { theme } = useTheme();
  const activeTheme = themeVariant || theme || 'new-emerald';
  const isNewTheme = activeTheme === 'new-emerald';

  // Dimension map (balanced for mobile and desktop viewports)
  const pixelSizes = {
    xs: 28,
    sm: 40,
    md: 52,
    lg: 84,
    xl: 128,
  };

  const px = pixelSizes[size] || 52;

  // Colors based on theme variant
  // New Emerald: Champagne satin gold & royal pine green
  // Classic Dark: Cognac honey oak & deep forest charcoal
  const goldPrimary = isNewTheme ? '#DFBA87' : '#C48B4C';
  const goldLight = isNewTheme ? '#F5E4CB' : '#DBA366';
  const goldDark = isNewTheme ? '#B58B55' : '#8A5926';

  const circleBgCenter = isNewTheme ? '#0E2F26' : '#142924';
  const circleBgMid = isNewTheme ? '#08221D' : '#0B1E1B';
  const circleBgEdge = isNewTheme ? '#051915' : '#071513';

  // SVG Unique Gradient ID
  const gradId = `dal-gold-${size}-${activeTheme}`;
  const bgGradId = `dal-bg-${size}-${activeTheme}`;

  const hasExplicitWidth = className.includes('w-');
  const hasExplicitHeight = className.includes('h-');

  if (!circular) {
    // Pure Emblem & Typography (Transparent background for navbar/compact lockups)
    return (
      <div 
        className={`inline-flex items-center justify-center select-none shrink-0 aspect-[600/660] ${className}`}
        style={{
          width: hasExplicitWidth ? undefined : px,
          height: hasExplicitHeight ? undefined : Math.round(px * 1.1),
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '600 / 660',
        }}
      >
        <svg
          viewBox="0 0 600 660"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full aspect-[600/660] object-contain block shrink-0 transition-transform duration-300 hover:scale-105"
          aria-label="لوگوی رسمی کافه دال"
        >
          <defs>
            <linearGradient id={gradId} x1="150" y1="100" x2="480" y2="550" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={goldLight} />
              <stop offset="35%" stopColor={goldPrimary} />
              <stop offset="75%" stopColor={goldDark} />
              <stop offset="100%" stopColor={goldLight} />
            </linearGradient>
          </defs>

          {/* The Calligraphic 'د' (Dal) sweeping crescent */}
          <path
            d="M 335 110 
               C 350 145, 385 180, 420 220 
               C 455 260, 470 315, 465 375 
               C 458 440, 425 498, 368 535 
               C 310 572, 230 580, 150 528 
               C 178 545, 235 565, 305 540 
               C 375 515, 422 458, 435 390 
               C 445 330, 425 270, 380 215 
               C 345 175, 335 140, 335 110 Z"
            fill={`url(#${gradId})`}
          />

          {/* Steaming Coffee Cup: Upper Wisp / Steam */}
          <path
            d="M 292 215 
               C 275 250, 310 285, 280 320 
               C 272 330, 260 340, 250 348 
               C 265 338, 282 322, 285 305 
               C 290 280, 268 250, 292 215 Z"
            fill={`url(#${gradId})`}
          />

          {/* Secondary Steam Wisp */}
          <path
            d="M 315 260 
               C 305 285, 320 305, 302 328 
               C 310 315, 318 298, 315 282 
               C 312 272, 314 265, 315 260 Z"
            fill={`url(#${gradId})`}
            opacity="0.85"
          />

          {/* Coffee Cup: Bowl & Rim */}
          <path
            d="M 198 385 
               C 265 330, 345 350, 375 400 
               C 370 420, 355 450, 332 475 
               C 300 510, 255 540, 202 548 
               C 248 518, 295 480, 320 435 
               C 335 410, 315 385, 260 378 
               C 230 375, 210 380, 198 385 Z"
            fill={`url(#${gradId})`}
          />

          {/* Coffee Cup: Handle */}
          <path
            d="M 368 402 
               C 402 410, 412 435, 408 455 
               C 402 478, 375 490, 352 492 
               C 370 485, 392 472, 395 452 
               C 398 435, 388 420, 368 412 Z"
            fill={`url(#${gradId})`}
          />

          {/* Typography Lockup: DAL CAFÉ */}
          {showText && (
            <text
              x="300"
              y="635"
              textAnchor="middle"
              fill={`url(#${gradId})`}
              fontSize="34"
              fontFamily="'Times New Roman', serif"
              fontWeight="700"
              letterSpacing="0.42em"
            >
              DAL CAFÉ
            </text>
          )}
        </svg>
      </div>
    );
  }

  // Full Circular Badge (viewBox 0 0 800 800 - True 1:1 Aspect Ratio)
  return (
    <div 
      className={`inline-flex items-center justify-center select-none shrink-0 aspect-square ${className}`}
      style={{
        width: hasExplicitWidth ? undefined : px,
        height: hasExplicitHeight ? undefined : px,
        maxWidth: '100%',
        maxHeight: '100%',
        aspectRatio: '1 / 1',
      }}
    >
      <svg
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full aspect-square object-contain block shrink-0 drop-shadow-md transition-transform duration-300 hover:scale-105"
        aria-label="لوگوی رسمی کافه دال"
      >
        <defs>
          {/* Radial Background to replicate the deep forest pine shading */}
          <radialGradient id={bgGradId} cx="400" cy="380" r="400" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={circleBgCenter} />
            <stop offset="65%" stopColor={circleBgMid} />
            <stop offset="100%" stopColor={circleBgEdge} />
          </radialGradient>

          {/* Brushed Satin Gold Metallic Gradient */}
          <linearGradient id={gradId} x1="220" y1="160" x2="620" y2="680" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={goldLight} />
            <stop offset="25%" stopColor={goldPrimary} />
            <stop offset="60%" stopColor={goldDark} />
            <stop offset="85%" stopColor={goldPrimary} />
            <stop offset="100%" stopColor={goldLight} />
          </linearGradient>

          {/* 3D drop shadow filter */}
          <filter id={`shadow-${size}-${activeTheme}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Circular Background Badge */}
        <circle cx="400" cy="400" r="392" fill={`url(#${bgGradId})`} />
        
        {/* Subtle Outer Bevel Ring */}
        <circle cx="400" cy="400" r="392" stroke={`url(#${gradId})`} strokeWidth="1.5" strokeOpacity="0.25" />

        {/* Central Emblem Group with Drop Shadow */}
        <g filter={`url(#shadow-${size}-${activeTheme})`}>
          {/* Calligraphic 'د' (Dal) Crescent */}
          <path
            d="M 445 160 
               C 465 210, 515 260, 560 315 
               C 605 370, 622 445, 612 525 
               C 600 610, 555 680, 480 725 
               C 405 770, 305 775, 205 710 
               C 240 730, 310 755, 395 725 
               C 480 695, 540 625, 560 540 
               C 572 460, 550 380, 495 305 
               C 455 250, 442 200, 445 160 Z"
            fill={`url(#${gradId})`}
          />

          {/* Steaming Coffee Cup: Primary Steam Wisp */}
          <path
            d="M 390 285 
               C 368 332, 415 375, 375 422 
               C 362 435, 345 448, 332 458 
               C 352 445, 375 425, 380 402 
               C 388 370, 358 330, 390 285 Z"
            fill={`url(#${gradId})`}
          />

          {/* Steaming Coffee Cup: Secondary Delicate Steam */}
          <path
            d="M 420 345 
               C 408 375, 428 402, 405 432 
               C 415 415, 425 392, 422 372 
               C 418 360, 420 352, 420 345 Z"
            fill={`url(#${gradId})`}
            opacity="0.88"
          />

          {/* Coffee Cup: Bowl & Sweeping Rim */}
          <path
            d="M 265 498 
               C 350 430, 450 455, 488 515 
               C 480 542, 460 580, 430 612 
               C 390 655, 335 690, 270 702 
               C 328 662, 388 615, 418 558 
               C 438 525, 412 495, 345 488 
               C 305 485, 280 492, 265 498 Z"
            fill={`url(#${gradId})`}
          />

          {/* Coffee Cup: Curved Handle */}
          <path
            d="M 480 520 
               C 525 530, 538 560, 532 588 
               C 525 618, 490 635, 460 638 
               C 482 628, 510 612, 515 585 
               C 520 562, 505 542, 480 532 Z"
            fill={`url(#${gradId})`}
          />
        </g>

        {/* Brand Text: DAL CAFÉ */}
        {showText && (
          <text
            x="400"
            y="675"
            textAnchor="middle"
            fill={`url(#${gradId})`}
            fontSize="38"
            fontFamily="'Cinzel', 'Times New Roman', serif"
            fontWeight="600"
            letterSpacing="0.48em"
            className="select-none"
          >
            DAL CAFÉ
          </text>
        )}
      </svg>
    </div>
  );
}
