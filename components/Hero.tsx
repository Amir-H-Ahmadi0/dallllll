'use client';

import React from 'react';
import { CafeInfo } from '@/types/menu';
import { Coffee, MapPin } from 'lucide-react';
import { DalLogo } from './DalLogo';
import { useTheme } from './ThemeContext';
import { motion } from 'motion/react';

interface HeroProps {
  cafeInfo: CafeInfo;
}

export function Hero({ cafeInfo }: HeroProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 68;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  return (
    <section 
      id="top" 
      className={`relative overflow-hidden py-4 sm:py-12 md:py-16 border-b transition-colors duration-300 wood-slat-subtle ${
        isEmerald 
          ? 'bg-[#051A15] border-[#1A443A]' 
          : 'bg-[#071513] border-[#233833]'
      }`}
    >
      {/* Warm intimate ambient glow */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[250px] blur-[120px] rounded-full pointer-events-none -z-10 ${
          isEmerald ? 'bg-[#DFBA87]/12' : 'bg-[#C48B4C]/10'
        }`}
        aria-hidden="true" 
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        
        {/* Welcome Kicker on Mobile */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border text-[9.5px] sm:text-[11px] font-bold mb-3 sm:mb-4 transition-colors ${
          isEmerald
            ? 'bg-[#0B251E] border-[#275A4D] text-[#DFBA87]'
            : 'bg-[#122420] border-[#23423A] text-[#C48B4C]'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>منوی دیجیتال کافه دال · خوش آمدید</span>
        </div>

        {/* The Iconic Dal Brand Card - Showcasing the exact Official Circular Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-full max-w-sm rounded-2xl sm:rounded-3xl p-4 sm:p-7 border flex flex-col items-center justify-center text-center shadow-xl transition-all duration-300 wood-glow mb-4 sm:mb-5 ${
            isEmerald
              ? 'bg-[#08221D] border-[#1E4D41] text-[#F6F4EE]'
              : 'bg-[#142421] border-[#384F49] text-[#F0EDE5]'
          }`}
        >
          {/* Circular Official Logo from user reference */}
          <div className="w-20 h-20 sm:w-32 sm:h-32 mb-2 sm:mb-3 shrink-0 aspect-square flex items-center justify-center">
            <DalLogo 
              size="lg" 
              circular={true} 
              themeVariant={theme}
              showText={true}
              className="w-full h-full" 
            />
          </div>

          <h1 className="text-xl sm:text-3xl font-black mb-1">
            کافه دال
          </h1>
          <p className={`text-[9.5px] sm:text-[11px] uppercase font-bold mb-3 sm:mb-4 tracking-wider transition-colors ${
            isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
          }`}>
            DALL CAFÉ · EST. 2024
          </p>

          <div className={`text-[10.5px] sm:text-xs font-medium border-t pt-2.5 sm:pt-3 w-full flex items-center justify-center gap-1.5 sm:gap-2 ${
            isEmerald 
              ? 'border-[#1E4D41] text-[#CAD6D2]' 
              : 'border-[#2D433E] text-[#CCD7D2]'
          }`}>
            <span>{cafeInfo.slogan}</span>
            <span>·</span>
            <span className="tracking-wide text-[9.5px] sm:text-xs">A PLACE TO PAUSE</span>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          className="flex items-center justify-center gap-2 sm:gap-2.5 w-full"
        >
          <a
            href="#menu"
            onClick={(e) => handleSmoothScroll(e, 'menu')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl font-bold text-[11px] sm:text-xs hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-md cursor-pointer ${
              isEmerald
                ? 'bg-[#DFBA87] hover:bg-[#EED0A6] text-[#1E170F] shadow-[#DFBA87]/25'
                : 'bg-[#C48B4C] hover:bg-[#DBA366] text-[#1B1107] shadow-[#C48B4C]/25'
            }`}
          >
            <Coffee className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>مشاهده منو و قیمت‌ها</span>
          </a>

          <a
            href="#routing"
            onClick={(e) => handleSmoothScroll(e, 'routing')}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl border hover:-translate-y-0.5 active:scale-95 font-semibold text-[11px] sm:text-xs transition-all duration-200 shadow-sm cursor-pointer ${
              isEmerald
                ? 'bg-[#0B251E] hover:bg-[#0F2F27] text-[#F6F4EE] border-[#1E483D] hover:border-[#DFBA87]/70'
                : 'bg-[#1C2C28] hover:bg-[#253934] text-[#F0EDE5] border-[#384F49] hover:border-[#C48B4C]/70'
            }`}
          >
            <MapPin className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'}`} />
            <span>مسیریابی حضوری</span>
          </a>
        </motion.div>

        {/* Operating Hours Whisper */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 text-[11px] sm:text-xs text-[#A8BCB5] flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>پذیرای شما: همه‌روزه از ۸:۰۰ تا ۲۳:۳۰</span>
        </motion.div>

      </div>
    </section>
  );
}
