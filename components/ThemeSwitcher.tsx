'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES, ThemeMode } from './ThemeContext';
import { Palette, Check } from 'lucide-react';

interface ThemeSwitcherProps {
  variant?: 'header' | 'footer' | 'compact';
  className?: string;
}

export function ThemeSwitcher({ variant = 'header', className = '' }: ThemeSwitcherProps) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[theme] || THEMES['new-emerald'];
  const isEmerald = theme === 'new-emerald';

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Variant: Footer (Full visual switcher cards)
  if (variant === 'footer') {
    return (
      <div className={`p-4 rounded-2xl border transition-colors ${
        isEmerald 
          ? 'bg-[#061E18]/80 border-[#1A443A]' 
          : 'bg-[#091D19]/80 border-[#1E3D37]'
      } ${className}`}>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Palette className={`w-4 h-4 ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'}`} />
            <span className="text-xs font-bold text-[#F6F4EE]">
              پوسته و تم رنگی کافه دال (Theme)
            </span>
          </div>
          <span className="text-[10px] text-[#A8BCB5]">
            ذخیره دائمی در حافظه مرورگر
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Royal Pine Emerald */}
          <button
            type="button"
            onClick={() => setTheme('new-emerald')}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 active:scale-98 cursor-pointer ${
              theme === 'new-emerald'
                ? 'bg-[#082821] border-[#DFBA87] ring-1 ring-[#DFBA87]/40 shadow-sm'
                : 'bg-[#051A15]/60 border-[#1A443A] hover:border-[#28594E] opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Color Swatch Dot */}
              <div className="w-6 h-6 rounded-lg bg-[#051A15] border border-[#DFBA87]/60 flex items-center justify-center shrink-0 p-0.5">
                <div className="w-full h-full rounded bg-gradient-to-br from-[#DFBA87] to-[#08221D]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#F6F4EE] flex items-center gap-1.5">
                  <span>Royal Pine Emerald</span>
                  {theme === 'new-emerald' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#DFBA87] text-[#1E170F] font-black">
                      فعال
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#DFBA87] font-medium truncate">
                  سبز زمردی و طلای شامپاینی
                </div>
              </div>
            </div>
            {theme === 'new-emerald' && (
              <Check className="w-4 h-4 text-[#DFBA87] shrink-0" />
            )}
          </button>

          {/* Classic Cognac */}
          <button
            type="button"
            onClick={() => setTheme('classic-dark')}
            className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 active:scale-98 cursor-pointer ${
              theme === 'classic-dark'
                ? 'bg-[#122420] border-[#C48B4C] ring-1 ring-[#C48B4C]/40 shadow-sm'
                : 'bg-[#071513]/60 border-[#1E3D37] hover:border-[#2D5047] opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Color Swatch Dot */}
              <div className="w-6 h-6 rounded-lg bg-[#071513] border border-[#C48B4C]/60 flex items-center justify-center shrink-0 p-0.5">
                <div className="w-full h-full rounded bg-gradient-to-br from-[#C48B4C] to-[#10221E]" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#F0EDE5] flex items-center gap-1.5">
                  <span>Classic Cognac</span>
                  {theme === 'classic-dark' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#C48B4C] text-[#1B1107] font-black">
                      فعال
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#C48B4C] font-medium truncate">
                  کنیاک کهربایی و گردویی
                </div>
              </div>
            </div>
            {theme === 'classic-dark' && (
              <Check className="w-4 h-4 text-[#C48B4C] shrink-0" />
            )}
          </button>
        </div>
      </div>
    );
  }

  // Variant: Header (Desktop 2-segment switch + Mobile toggle with dropdown)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Desktop Segmented Pill Switch (shown on sm and larger) */}
      <div 
        className={`hidden sm:inline-flex items-center p-1 rounded-xl border backdrop-blur-md transition-colors select-none ${
          isEmerald 
            ? 'bg-[#061E18]/90 border-[#1A443A]' 
            : 'bg-[#091D19]/90 border-[#1E3D37]'
        }`}
        role="group"
        aria-label="تغییر تم رنگی کافه دال"
      >
        {/* Royal Pine Emerald Tab */}
        <button
          type="button"
          onClick={() => setTheme('new-emerald')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer ${
            theme === 'new-emerald'
              ? 'bg-[#0A2D24] text-[#DFBA87] border border-[#DFBA87]/40 shadow-xs'
              : 'text-[#A8BCB5] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Royal Pine Emerald - سبز زمردی و شامپاینی"
        >
          <span className="w-2 h-2 rounded-full bg-[#DFBA87] inline-block shrink-0 shadow-xs" />
          <span>Royal Pine</span>
        </button>

        {/* Classic Cognac Tab */}
        <button
          type="button"
          onClick={() => setTheme('classic-dark')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all duration-200 cursor-pointer ${
            theme === 'classic-dark'
              ? 'bg-[#142823] text-[#C48B4C] border border-[#C48B4C]/40 shadow-xs'
              : 'text-[#A2B2AC] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Classic Cognac - کهربایی و چوب گردو"
        >
          <span className="w-2 h-2 rounded-full bg-[#C48B4C] inline-block shrink-0 shadow-xs" />
          <span>Classic Cognac</span>
        </button>
      </div>

      {/* Mobile Compact Button: One-tap toggle with active swatch */}
      <button
        type="button"
        onClick={toggleTheme}
        className={`sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
          isEmerald
            ? 'bg-[#08221D] text-[#DFBA87] border-[#1A443A] hover:border-[#DFBA87]'
            : 'bg-[#10221E] text-[#C48B4C] border-[#1E3D37] hover:border-[#C48B4C]'
        }`}
        title={`پوسته فعلی: ${currentTheme.name} (کلیک برای جابجایی)`}
        aria-label="تغییر تم رنگی"
      >
        <span 
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs transition-colors"
          style={{ backgroundColor: currentTheme.accent }}
        />
        <span className="text-[10px] tracking-tight">
          {theme === 'new-emerald' ? 'Emerald' : 'Cognac'}
        </span>
      </button>
    </div>
  );
}
