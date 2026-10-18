'use client';

import React, { useEffect } from 'react';
import { MenuItem } from '@/types/menu';
import { formatPrice } from '@/lib/formatters';
import { 
  X, 
  Coffee, 
  Sparkles, 
  Flame, 
  CupSoda, 
  Utensils,
  ChevronLeft
} from 'lucide-react';
import { DalLogo } from './DalLogo';
import { FlavorProfileBar } from './FlavorProfileBar';
import { useTheme } from './ThemeContext';

interface ItemDetailModalProps {
  item: MenuItem | null;
  allItems?: MenuItem[];
  onClose: () => void;
  onSelectItem?: (item: MenuItem) => void;
}

export function ItemDetailModal({
  item,
  allItems = [],
  onClose,
  onSelectItem,
}: ItemDetailModalProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  // Prevent background scroll when modal is active & support ESC key
  useEffect(() => {
    if (!item) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  // Temperature determination
  const isCold = 
    item.temperature === 'cold' || 
    item.titleFa?.includes('آیس') || 
    item.titleFa?.includes('سرد') || 
    item.titleEn?.toLowerCase().includes('iced') || 
    item.titleEn?.toLowerCase().includes('cold') || 
    item.tags?.some(t => t.includes('سرد') || t.includes('آیس'));

  const pairedItem = item.pairingItemId 
    ? allItems.find((it) => it.id === item.pairingItemId) || null 
    : null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-4 pb-16 sm:pb-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none overflow-y-auto"
      onClick={onClose}
    >
      {/* 
        Compact, Proportionate & Refined Box:
        - Harmoniously centered with safe distance above bottom navigation
        - Spacings and paddings are balanced and comfortable
      */}
      <div
        className={`relative w-full max-w-[390px] sm:max-w-[440px] rounded-[22px] sm:rounded-[26px] p-4 shadow-[0_16px_50px_rgba(0,0,0,0.85)] text-right animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[58vh] sm:max-h-[490px] overflow-hidden my-auto mb-12 sm:mb-auto border transition-all ${
          isEmerald 
            ? 'bg-gradient-to-b from-[#09261F] via-[#071D18] to-[#041410] border-[#DFBA87]/25' 
            : 'bg-gradient-to-b from-[#142621] via-[#0D1E1A] to-[#061512] border-[#C48B4C]/25'
        }`}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${
              isEmerald 
                ? 'bg-[#10332A] text-[#DFBA87] border-[#255648]' 
                : 'bg-[#18312B] text-[#DBA366] border-[#2C4F46]'
            }`}>
              {isCold ? (
                <CupSoda className="w-2.5 h-2.5 text-sky-400" />
              ) : (
                <Flame className="w-2.5 h-2.5 text-amber-400" />
              )}
              <span>{isCold ? 'سرد و باطراوت' : 'گرم و تازه دم'}</span>
            </span>

            <span className="text-[9.5px] text-[#8EA39C]">
              کافه دال
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 text-[#A2B2AC] hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="بستن"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Compact Body with Balanced Margins */}
        <div className="overflow-y-auto py-2.5 space-y-2.5 flex-1 text-xs text-[#CCD7D2] pr-0.5 pl-0.5 scrollbar-none">
          
          {/* Hero Row: Thumbnail + Titles + Price */}
          <div className="flex items-start gap-2.5">
            
            {/* Square Product Thumbnail */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/15 shadow-sm">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.titleFa}
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-1.5">
                  <div className="w-8 h-8 shrink-0 aspect-square flex items-center justify-center">
                    <DalLogo size="sm" showText={false} circular={true} className="w-full h-full" />
                  </div>
                </div>
              )}
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="text-[8px] font-bold text-rose-300 px-1 py-0.5 rounded bg-rose-950/80 border border-rose-500/40">
                    اتمام موجودی
                  </span>
                </div>
              )}
            </div>

            {/* Titles & Price Tag */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-[#F6F4EE] leading-snug break-words whitespace-normal">
                  {item.titleFa}
                </h3>
                {item.titleEn && (
                  <p className="text-[9.5px] sm:text-[10px] text-[#A8BCB5] font-serif italic tracking-wide break-words whitespace-normal mt-0.5">
                    {item.titleEn}
                  </p>
                )}
              </div>

              {/* Price Pill */}
              <div className="inline-flex items-baseline gap-1 self-start px-2 py-0.5 rounded-md border bg-black/40 border-white/10 shadow-xs mt-1">
                <span className={`text-[11px] sm:text-xs font-black tabular-nums ${isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]'}`}>
                  {formatPrice(item.price)}
                </span>
                <span className="text-[8.5px] text-[#A89381] font-medium">تومان</span>
              </div>
            </div>
          </div>

          {/* Aroma Notes (طعم‌یادها) */}
          {item.aromaNotes && item.aromaNotes.length > 0 && (
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/10 space-y-1">
              <span className={`text-[10px] font-bold flex items-center gap-1 ${isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]'}`}>
                <Sparkles className="w-2.5 h-2.5" />
                <span>طعم‌یادها:</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {item.aromaNotes.map((note, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[9.5px] font-medium text-[#F0EDE5]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
              <p className="text-[11px] text-[#D8E2DE] leading-relaxed break-words whitespace-normal">
                {item.description}
              </p>
            </div>
          )}

          {/* Specialty Flavor Profile Bar */}
          {item.flavorProfile && (
            <div className="pt-0.5">
              <FlavorProfileBar profile={item.flavorProfile} />
            </div>
          )}

          {/* Smart Pairing Recommendation (همنشین پیشنهادی باریستا - فشرده و متناسب) */}
          {pairedItem && (
            <div className={`p-2.5 rounded-lg border transition-all relative overflow-hidden ${
              isEmerald 
                ? 'bg-gradient-to-b from-[#10342B] to-[#0A241E] border-[#245B4D]' 
                : 'bg-gradient-to-b from-[#162D28] to-[#0C1D19] border-[#264A41]'
            }`}>
              {/* Pairing Header */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1">
                  <Sparkles className={`w-2.5 h-2.5 ${isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]'}`} />
                  <span className={`text-[10px] font-black ${
                    isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]'
                  }`}>
                    همنشین پیشنهادی باریستا
                  </span>
                </div>

                <div className="flex items-baseline gap-1 text-[9.5px] font-bold text-[#A8BCB5] bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
                  <span className={`tabular-nums font-black ${isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]'}`}>
                    {formatPrice(pairedItem.price)}
                  </span>
                  <span className="text-[8px] text-[#8EA39C]">ت</span>
                </div>
              </div>

              {/* Paired Product Info: Image + Title */}
              <div className="flex items-center gap-2 mb-1.5">
                <div className="relative w-8 h-8 rounded-md overflow-hidden bg-black/40 shrink-0 border border-white/10 shadow-xs">
                  {pairedItem.imageUrl ? (
                    <img 
                      src={pairedItem.imageUrl} 
                      alt={pairedItem.titleFa}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#DFBA87]">
                      <Coffee className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-right">
                  <h4 className="text-[11px] font-black text-[#F6F4EE] leading-snug break-words whitespace-normal">
                    {pairedItem.titleFa}
                  </h4>
                  {pairedItem.titleEn && (
                    <p className="text-[9px] text-[#8EA39C] font-serif italic truncate">
                      {pairedItem.titleEn}
                    </p>
                  )}
                </div>
              </div>

              {/* Pairing Note / Barista Reason */}
              {item.pairingNote && (
                <div className="p-1.5 rounded bg-black/35 border border-white/10 mb-2 text-right">
                  <p className="text-[10px] text-[#E0DDD5] leading-relaxed break-words whitespace-normal">
                    ❝ {item.pairingNote} ❞
                  </p>
                </div>
              )}

              {/* Action Button: View Paired Item */}
              <button
                type="button"
                onClick={() => onSelectItem?.(pairedItem)}
                className={`w-full py-1.5 px-2.5 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1 active:scale-98 cursor-pointer shadow-xs ${
                  isEmerald
                    ? 'bg-[#184539] hover:bg-[#205A4B] text-[#DFBA87] hover:text-white border border-[#2D6F5E]'
                    : 'bg-[#1E3831] hover:bg-[#294B42] text-[#DBA366] hover:text-white border border-[#355B51]'
                }`}
                title={`مشاهده کامل ${pairedItem.titleFa}`}
              >
                <span>مشاهده مشخصات «{pairedItem.titleFa}»</span>
                <ChevronLeft className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Ingredients Note */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="text-[9.5px] text-[#8EA39C] flex items-center gap-1 px-0.5 pt-0.5">
              <Utensils className="w-2.5 h-2.5 text-[#C48B4C] shrink-0" />
              <span>ترکیبات: {item.ingredients.join(' · ')}</span>
            </div>
          )}

        </div>

        {/* Footer: Bottom Bar with Price & Close Button */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-[#8EA39C]">
            <span>قیمت:</span>
            <span className="font-bold text-white text-xs tabular-nums">
              {formatPrice(item.price)}
            </span>
            <span className="text-[9px]">تومان</span>
          </div>

          <button
            onClick={onClose}
            className={`py-1.5 px-4 rounded-lg font-bold text-xs transition-all active:scale-95 shadow-sm text-center cursor-pointer ${
              isEmerald
                ? 'bg-[#DFBA87] hover:bg-[#EED0A6] text-[#1E170F]'
                : 'bg-[#C48B4C] hover:bg-[#DBA366] text-[#1B1107]'
            }`}
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
}
