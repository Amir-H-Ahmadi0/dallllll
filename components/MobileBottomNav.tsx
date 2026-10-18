'use client';

import React, { useEffect, useState } from 'react';
import { Coffee, Sparkles, MapPin, PhoneCall } from 'lucide-react';
import { useTheme } from './ThemeContext';

export type NavSection = 'menu' | 'about' | 'routing' | 'contact';

interface MobileBottomNavProps {
  activeSection?: NavSection;
  onSelectSection: (section: NavSection) => void;
}

export function MobileBottomNav({
  activeSection: controlledActiveSection,
  onSelectSection,
}: MobileBottomNavProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';
  const [internalActive, setInternalActive] = useState<NavSection>('menu');

  // Track scroll position to automatically highlight the current section in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      const menuEl = document.getElementById('menu');
      const aboutEl = document.getElementById('about');
      const routingEl = document.getElementById('routing');
      const contactEl = document.getElementById('contact');

      if (contactEl && scrollPos >= contactEl.offsetTop - 80) {
        setInternalActive('contact');
      } else if (routingEl && scrollPos >= routingEl.offsetTop - 80) {
        setInternalActive('routing');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop - 80) {
        setInternalActive('about');
      } else if (menuEl && scrollPos >= menuEl.offsetTop - 80) {
        setInternalActive('menu');
      } else {
        setInternalActive('menu');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentSection = controlledActiveSection || internalActive;

  const accentColor = isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]';
  const accentBg = isEmerald ? 'bg-[#DFBA87]/15' : 'bg-[#C48B4C]/15';
  const activeDot = isEmerald ? 'bg-[#DFBA87]' : 'bg-[#C48B4C]';

  const navItems: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'menu',
      label: 'منوی آنلاین',
      icon: Coffee,
    },
    {
      id: 'about',
      label: 'درباره دال',
      icon: Sparkles,
    },
    {
      id: 'routing',
      label: 'مسیریابی',
      icon: MapPin,
    },
    {
      id: 'contact',
      label: 'ساعت و تماس',
      icon: PhoneCall,
    },
  ];

  return (
    <nav 
      aria-label="ناوبری سریع موبایل کافه دال"
      className={`fixed bottom-0 inset-x-0 z-50 md:hidden backdrop-blur-2xl border-t shadow-[0_-8px_30px_rgba(0,0,0,0.65)] select-none transition-colors duration-300 ${
        isEmerald 
          ? 'bg-[#051A15]/96 border-[#1A443A]' 
          : 'bg-[#071513]/96 border-[#1C3B35]'
      }`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 50,
        paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
      }}
      dir="rtl"
    >
      <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex flex-col items-center justify-center min-h-[46px] py-1 transition-all active:scale-90 cursor-pointer relative ${
                isActive ? 'text-white' : 'text-[#8EA39C] hover:text-[#CCD7D2]'
              }`}
              aria-label={item.label}
            >
              <div className={`relative px-2.5 py-0.5 rounded-full transition-all ${
                isActive ? accentBg : 'bg-transparent'
              }`}>
                <Icon className={`w-4.5 h-4.5 transition-transform ${
                  isActive ? `${accentColor} scale-110` : ''
                }`} />
              </div>
              <span className={`text-[10px] mt-0.5 transition-colors leading-tight ${
                isActive ? `font-black ${accentColor}` : 'font-medium'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <span className={`w-1 h-1 rounded-full ${activeDot} mt-0.5 animate-pulse`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
