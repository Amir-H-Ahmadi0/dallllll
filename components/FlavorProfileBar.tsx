'use client';

import React from 'react';
import { FlavorProfile } from '@/types/menu';
import { Zap, Droplets, Sparkles, Coffee, Heart } from 'lucide-react';
import { useTheme } from './ThemeContext';

export const RELEVANT_FLAVOR_CATEGORIES = [
  'espresso',
  'hot-bar',
  'tea',
  'cold-bar',
  'brew',
  'specialty',
  'tea-herbal',
];

export function isFlavorProfileCategory(categoryId?: string): boolean {
  if (!categoryId) return false;
  return RELEVANT_FLAVOR_CATEGORIES.includes(categoryId.toLowerCase());
}

interface FlavorProfileBarProps {
  profile?: FlavorProfile;
  compact?: boolean;
}

interface MetricConfig {
  key: keyof FlavorProfile;
  labelFa: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  getDescriptor: (val: number) => string;
}

const METRICS: MetricConfig[] = [
  {
    key: 'caffeine',
    labelFa: 'میزان کافئین',
    labelEn: 'Caffeine',
    icon: Zap,
    getDescriptor: (v) => {
      if (v <= 0) return 'بدون کافئین';
      if (v <= 2) return 'ملایم';
      if (v === 3) return 'متوسط';
      if (v === 4) return 'بالا';
      return 'بسیار پرانرژی';
    },
  },
  {
    key: 'body',
    labelFa: 'بافت و غلظت',
    labelEn: 'Body & Texture',
    icon: Droplets,
    getDescriptor: (v) => {
      if (v <= 1) return 'سبک و زلال';
      if (v <= 2) return 'روان و سبک';
      if (v === 3) return 'متوسط و یکنواخت';
      if (v === 4) return 'غلیظ و سنگین';
      return 'بسیار متراکم و مخملی';
    },
  },
  {
    key: 'acidity',
    labelFa: 'اسیدیته و طراوت',
    labelEn: 'Acidity',
    icon: Sparkles,
    getDescriptor: (v) => {
      if (v <= 1) return 'بسیار کم و لطیف';
      if (v <= 2) return 'کم‌اسید و شکلاتی';
      if (v === 3) return 'متعادل و مرکباتی';
      if (v === 4) return 'زنده و میوه‌ای';
      return 'طعم‌یاد شفاف میوه‌ای';
    },
  },
  {
    key: 'bitterness',
    labelFa: 'تلخی اصیل',
    labelEn: 'Bitterness',
    icon: Coffee,
    getDescriptor: (v) => {
      if (v <= 0) return 'نامحسوس';
      if (v <= 2) return 'ملایم و شیرین';
      if (v === 3) return 'شکلات تلخ ملایم';
      if (v === 4) return 'تلخ بارز و عمیق';
      return 'تلخی غلیظ و ماندگار';
    },
  },
  {
    key: 'sweetness',
    labelFa: 'شیرینی ذاتی',
    labelEn: 'Sweetness',
    icon: Heart,
    getDescriptor: (v) => {
      if (v <= 0) return 'خشک و بدون شیرینی';
      if (v <= 2) return 'شیرینی طبیعی ملایم';
      if (v === 3) return 'عسلی و متوازن';
      if (v === 4) return 'شیرین و کاراملی';
      return 'شیرین و دسرگونه';
    },
  },
];

export function FlavorProfileBar({ profile, compact = false }: FlavorProfileBarProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  if (!profile) return null;

  // Check if at least one metric is defined
  const hasValues = METRICS.some((m) => profile[m.key] !== undefined && profile[m.key] !== null);
  if (!hasValues) return null;

  const activeColor = isEmerald ? 'bg-[#DFBA87]' : 'bg-[#C48B4C]';
  const activeTextColor = isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]';
  const inactiveDot = isEmerald ? 'bg-white/10' : 'bg-black/30';

  if (compact) {
    // Compact preview for product card: show caffeine and body
    const caffeineVal = profile.caffeine ?? 0;
    const bodyVal = profile.body ?? 0;

    return (
      <div className="flex items-center gap-2.5 text-[10px] text-[#A2B2AC] mt-1 select-none">
        {/* Caffeine compact */}
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400/90" />
          <span className="font-medium text-[9.5px]">کافئین:</span>
          <div className="flex items-center gap-0.5" dir="ltr">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span
                key={dot}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  dot <= caffeineVal ? activeColor : inactiveDot
                }`}
              />
            ))}
          </div>
        </div>

        {/* Separator dot */}
        <span className="text-white/20">·</span>

        {/* Body compact */}
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3 text-[#DFBA87]/90" />
          <span className="font-medium text-[9.5px]">غلظت:</span>
          <div className="flex items-center gap-0.5" dir="ltr">
            {[1, 2, 3, 4, 5].map((dot) => (
              <span
                key={dot}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  dot <= bodyVal ? activeColor : inactiveDot
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full detailed flavor profile for ItemDetailModal
  return (
    <div 
      className={`p-3.5 rounded-2xl border space-y-2.5 transition-colors select-none ${
        isEmerald 
          ? 'bg-[#081F19]/90 border-[#1B4B3F]' 
          : 'bg-[#0E2521]/90 border-[#224039]'
      }`}
      dir="rtl"
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${activeTextColor}`} />
          <span className="text-xs font-black text-[#F0EDE5]">
            پروفایل طعمی و شاخص‌های تخصصی
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#8EA39C] tracking-en">
          Flavor Profile
        </span>
      </div>

      <div className="space-y-2 pt-0.5">
        {METRICS.map((metric) => {
          const value = profile[metric.key] ?? 0;
          const Icon = metric.icon;
          const descriptor = metric.getDescriptor(value);

          return (
            <div key={metric.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#CCD7D2]">
                  <Icon className="w-3.5 h-3.5 text-[#8EA39C]" />
                  <span className="font-bold">{metric.labelFa}</span>
                  <span className="text-[9.5px] text-[#7A938B] font-mono tracking-tight hidden sm:inline">
                    ({metric.labelEn})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-[#A2B2AC]">
                    {descriptor}
                  </span>
                  <span className={`text-[11px] font-bold font-mono ${activeTextColor}`}>
                    {value}/۵
                  </span>
                </div>
              </div>

              {/* 5-step Segmented Progress Bar */}
              <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-black/30 p-0.5 rounded-full" dir="ltr">
                {[1, 2, 3, 4, 5].map((step) => {
                  const isFilled = step <= value;
                  return (
                    <div
                      key={step}
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFilled ? activeColor : inactiveDot
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
