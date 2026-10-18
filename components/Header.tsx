'use client';

import React from 'react';
import { DalLogo } from './DalLogo';
import { useTheme } from './ThemeContext';
import { Lock, Coffee } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export function Header({ 
  onOpenAdmin, 
  isAdminLoggedIn,
}: HeaderProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  // Smooth scroll handler with fixed header offset compensation
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', ' ');
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 68;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-40 w-full backdrop-blur-xl border-b shadow-md transition-all duration-300 select-none ${
        isEmerald 
          ? 'bg-[#051A15]/95 border-[#1A443A]' 
          : 'bg-[#071513]/95 border-[#1E3D37]'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 40,
      }}
    >
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
        
        {/* Brand wordmark & Circular Monogram */}
        <a
          href="#top"
          onClick={(e) => handleSmoothScroll(e, 'top')}
          className="flex items-center gap-2 sm:gap-2.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#DFBA87] cursor-pointer shrink-0"
          aria-label="کافه دال - صفحه نخست"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 aspect-square flex items-center justify-center">
            <DalLogo 
              size="sm" 
              showText={false} 
              circular={true}
              themeVariant={theme}
              className="w-full h-full" 
            />
          </div>
          <div className="flex flex-col text-right shrink-0">
            <span className="text-[15px] sm:text-xl font-black text-[#F6F4EE] group-hover:text-white transition-colors leading-tight">
              کافه دال
            </span>
            <span className={`text-[8.5px] sm:text-[10px] font-semibold tracking-wider transition-colors ${
              isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
            }`}>
              DALL CAFÉ
            </span>
          </div>
        </a>

        {/* Desktop Navigation links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[#A8BCB5]">
          <a
            href="#menu"
            onClick={(e) => handleSmoothScroll(e, 'menu')}
            className="px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-[#F6F4EE] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            منوی آنلاین
          </a>
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-[#F6F4EE] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            درباره دال
          </a>
          <a
            href="#routing"
            onClick={(e) => handleSmoothScroll(e, 'routing')}
            className="px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-[#F6F4EE] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            مسیریابی و نقشه
          </a>
          <a
            href="#contact"
            onClick={(e) => handleSmoothScroll(e, 'contact')}
            className="px-3 py-1.5 rounded-xl hover:bg-white/5 hover:text-[#F6F4EE] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            ساعت کاری و تماس
          </a>
        </nav>

        {/* Action Buttons: Menu CTA + Admin Lock */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Direct Menu CTA (Desktop) */}
          <a
            href="#menu"
            onClick={(e) => handleSmoothScroll(e, 'menu')}
            className={`hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 shadow-sm active:scale-95 cursor-pointer ${
              isEmerald
                ? 'bg-[#DFBA87] hover:bg-[#EED0A6] text-[#1E170F] shadow-[#DFBA87]/20'
                : 'bg-[#C48B4C] hover:bg-[#DBA366] text-[#1B1107] shadow-[#C48B4C]/20'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>مشاهده منو</span>
          </a>

          {/* Admin Lock Button */}
          <button
            onClick={onOpenAdmin}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-medium rounded-xl border hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ${
              isAdminLoggedIn
                ? isEmerald 
                  ? 'bg-[#DFBA87] text-[#1E170F] border-[#DFBA87] shadow-sm font-bold'
                  : 'bg-[#C48B4C] text-[#1B1107] border-[#C48B4C] shadow-sm font-bold'
                : isEmerald
                  ? 'bg-[#08221D] text-[#A8BCB5] hover:text-white hover:bg-white/10 border-[#1A443A]'
                  : 'bg-[#10221F] text-[#8B9C96] hover:text-white hover:bg-white/10 border-[#243B35]'
            }`}
            title="ورود به پنل مدیریت منو"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">
              {isAdminLoggedIn ? 'مدیریت' : 'ورود'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
