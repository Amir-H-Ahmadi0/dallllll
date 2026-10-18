'use client';

import React, { useState } from 'react';
import { CafeInfo } from '@/types/menu';
import { DalLogo } from './DalLogo';
import { useTheme } from './ThemeContext';
import { 
  Phone, 
  Clock, 
  MapPin, 
  Lock, 
  Unlock 
} from 'lucide-react';

interface MobileDashboardHeaderProps {
  cafeInfo: CafeInfo;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onOpenInfo: () => void;
}

export function MobileDashboardHeader({
  cafeInfo,
  isAdminLoggedIn,
  onOpenAdmin,
  onOpenInfo,
}: MobileDashboardHeaderProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-40 w-full border-b backdrop-blur-xl shadow-md transition-colors select-none ${
        isEmerald 
          ? 'bg-[#051A15]/95 border-[#184439]' 
          : 'bg-[#071513]/95 border-[#224038]'
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
      {/* Top Bar: Cafe Identity + Live Status + Actions */}
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          
          {/* Cafe Monogram & Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl p-1 bg-black/30 border border-white/10 shrink-0 flex items-center justify-center">
              <DalLogo size="sm" circular={true} showText={false} themeVariant={theme} className="w-full h-full" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-black text-white leading-tight">
                  {cafeInfo.name}
                </h1>
                {/* Live Open Dot */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>الان باز است</span>
                </span>
              </div>
              <p className="text-[10px] text-[#8EA39C] mt-0.5">
                {cafeInfo.slogan}
              </p>
            </div>
          </div>

          {/* Action shortcuts: Admin */}
          <div className="flex items-center gap-1.5">

            {/* Admin Dashboard Entry button */}
            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl border transition-all active:scale-95 ${
                isAdminLoggedIn
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-white/5 text-[#8EA39C] hover:text-white border-white/10'
              }`}
              title={isAdminLoggedIn ? 'داشبورد مدیریت باز است' : 'ورود به داشبورد باریستا و مدیریت'}
              aria-label="ورود مدیریت"
            >
              {isAdminLoggedIn ? (
                <Unlock className="w-4 h-4 text-[#DFBA87]" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Dashboard Quick Glances Strip (Scrollable on small mobile screens) */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] scrollbar-none" dir="rtl">
          
          {/* Quick Widget 1: Working Hours */}
          <div className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/30 text-[#CCD7D2] flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>ساعت کاری: <strong className="text-white">۰۸:۳۰ - ۲۳:۳۰</strong></span>
          </div>

          {/* Quick Widget 2: Direct Phone Contact */}
          {cafeInfo.phone && (
            <a
              href={`tel:${cafeInfo.phone}`}
              className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/30 text-[#CCD7D2] hover:bg-white/5 flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>تماس با کافه: <strong className="font-mono text-white">{cafeInfo.phone}</strong></span>
            </a>
          )}

          {/* Quick Widget 3: Location / Map link */}
          <button
            onClick={onOpenInfo}
            className="px-3 py-1.5 rounded-xl border border-white/10 bg-black/30 text-[#CCD7D2] hover:bg-white/5 flex items-center gap-1.5 shrink-0 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>مسیریابی و آدرس کافه</span>
          </button>
        </div>

      </div>
    </header>
  );
}
