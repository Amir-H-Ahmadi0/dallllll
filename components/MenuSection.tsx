'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Category, MenuItem } from '@/types/menu';
import { formatPrice } from '@/lib/formatters';
import { 
  Coffee, 
  Flame, 
  Sparkles, 
  Leaf, 
  CupSoda, 
  Utensils, 
  Sandwich, 
  ArrowLeft, 
  Search, 
  X, 
  RotateCcw, 
  ChevronLeft,
  ChevronRight,
  Layers
} from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { ItemDetailModal } from './ItemDetailModal';
import { FlavorProfileBar } from './FlavorProfileBar';
import { DalLogo } from './DalLogo';
import { useTheme } from './ThemeContext';

interface MenuSectionProps {
  categories: Category[];
  items: MenuItem[];
}

// Category icon map helper
const getCategoryIcon = (iconName: string, className = "w-4 h-4 shrink-0") => {
  switch (iconName?.toLowerCase()) {
    case 'layers':
      return <Layers className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'leaf':
      return <Leaf className={className} />;
    case 'cupsoda':
      return <CupSoda className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'sandwich':
      return <Sandwich className={className} />;
    default:
      return <Coffee className={className} />;
  }
};

const productCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 16, 
    scale: 0.98 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface ItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

interface CategoryCardProps {
  id: string;
  nameFa: string;
  nameEn: string;
  iconName: string;
  count: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isEmerald: boolean;
}

// ==========================================
// Chic & Minimal Category Card Component (طراحی کارتی، شیک و مینیمال دسته‌بندی‌ها)
// ==========================================
function CategoryCard({
  nameFa,
  nameEn,
  iconName,
  count,
  isActive,
  onClick,
  isEmerald,
}: CategoryCardProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative text-right p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between shrink-0 snap-start min-w-[136px] sm:min-w-[155px] w-[136px] sm:w-[155px] h-[108px] sm:h-[116px] select-none ${
        isActive
          ? isEmerald
            ? 'bg-gradient-to-b from-[#143B31] to-[#0A261F] border-[#DFBA87] shadow-lg shadow-[#DFBA87]/15 ring-1 ring-[#DFBA87]/50'
            : 'bg-gradient-to-b from-[#1F3A32] to-[#122420] border-[#C48B4C] shadow-lg shadow-[#C48B4C]/15 ring-1 ring-[#C48B4C]/50'
          : isEmerald
            ? 'bg-[#08221D]/75 hover:bg-[#0D2F26] border-[#184439] hover:border-[#DFBA87]/40 shadow-xs hover:shadow-md'
            : 'bg-[#122420]/75 hover:bg-[#18312B] border-[#243F38] hover:border-[#C48B4C]/40 shadow-xs hover:shadow-md'
      }`}
      aria-pressed={isActive}
    >
      {/* Top Header of Card: Icon emblem + Item Count Pill */}
      <div className="flex items-center justify-between w-full">
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
            isActive
              ? isEmerald
                ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-bold'
                : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-bold'
              : isEmerald
                ? 'bg-black/35 text-[#A8BCB5] border border-white/5 group-hover:text-[#DFBA87] group-hover:border-[#DFBA87]/30'
                : 'bg-black/35 text-[#CCD7D2] border border-white/5 group-hover:text-[#C48B4C] group-hover:border-[#C48B4C]/30'
          }`}
        >
          {getCategoryIcon(iconName, 'w-4 h-4 shrink-0')}
        </div>

        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md tabular-nums transition-colors ${
            isActive
              ? isEmerald
                ? 'bg-[#DFBA87]/20 text-[#DFBA87] font-bold border border-[#DFBA87]/40'
                : 'bg-[#C48B4C]/20 text-[#DBA366] font-bold border border-[#C48B4C]/40'
              : 'bg-black/30 text-[#7E968F] border border-white/5'
          }`}
        >
          {count}
        </span>
      </div>

      {/* Card Content: Title Fa & Subtitle En */}
      <div className="mt-1">
        <h3
          className={`text-xs sm:text-sm font-black transition-colors leading-tight truncate ${
            isActive
              ? isEmerald
                ? 'text-[#DFBA87]'
                : 'text-[#DBA366]'
              : 'text-[#F0EDE5] group-hover:text-white'
          }`}
        >
          {nameFa}
        </h3>
        <p
          className={`text-[8.5px] sm:text-[10px] font-semibold tracking-wider uppercase truncate transition-colors mt-0.5 ${
            isActive
              ? isEmerald
                ? 'text-[#DFBA87]/80'
                : 'text-[#DBA366]/80'
              : 'text-[#8EA39C] group-hover:text-[#A8BCB5]'
          }`}
        >
          {nameEn}
        </p>
      </div>

      {/* Subtle active bottom glow indicator line */}
      {isActive && (
        <span 
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full ${
            isEmerald ? 'bg-[#DFBA87]' : 'bg-[#C48B4C]'
          }`} 
        />
      )}
    </motion.button>
  );
}

// ==========================================
// Product Card Component (طراحی اختصاصی و بهینه‌شده به سبک موبایل برای تمام دستگاه‌ها)
// ==========================================
function ProductCard({ 
  item, 
  onSelect, 
}: ItemCardProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  const cardBg = isEmerald 
    ? 'bg-[#0B251E] hover:bg-[#0F3027] border-[#1A443A] hover:border-[#DFBA87]/80 hover:shadow-[#DFBA87]/10' 
    : 'bg-[#10221E] hover:bg-[#152B26] border-[#243B35] hover:border-[#C48B4C]/80 hover:shadow-[#C48B4C]/10';

  const goldText = isEmerald ? 'text-[#DFBA87]' : 'text-[#DBA366]';
  const badgeStyle = isEmerald ? 'bg-[#123329] border-[#245244] text-[#DFBA87]' : 'bg-[#162C27] border-[#2A443E] text-[#DBA366]';
  const btnHover = isEmerald 
    ? 'group-hover:bg-[#DFBA87] group-hover:text-[#1E170F] group-hover:border-[#DFBA87]' 
    : 'group-hover:bg-[#C48B4C] group-hover:text-[#1B1107] group-hover:border-[#C48B4C]';

  return (
    <motion.div
      variants={productCardVariants}
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect(item)}
      className={`group relative p-3 sm:p-4 rounded-2xl border flex items-stretch justify-between gap-3 sm:gap-4 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl ${cardBg} ${
        !item.isAvailable ? 'opacity-65' : ''
      }`}
    >
      {/* Right / Information Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between text-right">
        <div>
          {/* Header titles */}
          <div className="mb-1">
            <h4 className="text-[15px] sm:text-lg font-black text-[#F0EDE5] group-hover:text-white transition-colors leading-snug break-words">
              {item.titleFa}
            </h4>
            <p className="text-[10px] sm:text-xs text-[#A2B2AC] font-medium tracking-wide break-words mt-0.5">
              {item.titleEn}
            </p>
          </div>

          {/* Aroma / Taste Notes Badges */}
          {item.aromaNotes && item.aromaNotes.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
              {item.aromaNotes.slice(0, 2).map((note, i) => (
                <span
                  key={i}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md border text-[9.5px] sm:text-[10px] font-semibold ${badgeStyle}`}
                >
                  {note}
                </span>
              ))}
            </div>
          ) : item.tags && item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1 mb-1.5">
              {item.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md border text-[9.5px] sm:text-[10px] font-semibold ${badgeStyle}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Description Preview */}
          {item.description && (
            <p className="text-[11.5px] sm:text-xs text-[#CCD7D2]/80 font-normal leading-relaxed line-clamp-2 mt-0.5">
              {item.description}
            </p>
          )}

          {/* Compact Specialty Flavor Profile (مخصوص نوشیدنی‌ها و قهوه) */}
          {item.flavorProfile && (
            <FlavorProfileBar profile={item.flavorProfile} compact={true} />
          )}
        </div>

        {/* Footer: Price + Details Trigger */}
        <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between gap-2">
          {/* Price Tag in Warm Gold */}
          <div className="flex items-baseline gap-1">
            <span className={`text-[14px] sm:text-base font-black tabular-nums ${goldText}`}>
              {formatPrice(item.price)}
            </span>
            <span className="text-[9.5px] sm:text-[10px] text-[#A89381] font-medium">تومان</span>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {!item.isAvailable && (
              <span className="text-[10px] text-rose-400 font-bold px-2 py-0.5 rounded-md bg-rose-950/40 border border-rose-500/20">
                ناموجود
              </span>
            )}

            <button 
              type="button"
              onClick={() => onSelect(item)}
              className={`text-[9.5px] sm:text-[11px] font-semibold px-2.5 sm:px-3 py-1 rounded-lg text-[#CCD7D2] bg-black/20 border border-white/10 transition-all flex items-center gap-1 ${btnHover}`}
            >
              <span>جزئیات</span>
              <ChevronLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform group-hover:-translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Left / Square Photo Thumbnail */}
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-black/40 shrink-0 border border-white/10 self-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.titleFa}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <div className="w-10 h-10 shrink-0 aspect-square flex items-center justify-center">
              <DalLogo size="sm" showText={false} circular={true} className="w-full h-full" />
            </div>
            <span className="text-[9px] text-[#A2B2AC] mt-1 font-medium">کافه دال</span>
          </div>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[9px] font-bold">
              ناموجود
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Helper for robust Persian & English search normalization
function normalizePersianText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[\u064A\u0649]/g, 'ی') // Arabic Yeh to Persian Yeh
    .replace(/[\u0643]/g, 'ک')       // Arabic Kaf to Persian Kaf
    .replace(/[\u0629]/g, 'ه')       // Teh Marbuta to Heh
    .replace(/[\u0622\u0623\u0625]/g, 'ا') // Alef with Hamza/Madda to simple Alef
    .replace(/[\u064B-\u065F\u0670]/g, '') // Diacritics/Aerab
    .replace(/\u200c/g, ' ')         // ZWNJ (half-space) to space
    .replace(/\s+/g, ' ')           // Multiple spaces to single space
    .trim();
}

function itemMatchesSearch(item: MenuItem, categories: Category[], query: string): boolean {
  if (!query || !query.trim()) return true;

  const rawQuery = query.toLowerCase().trim();
  const normQuery = normalizePersianText(query);
  const queryNoSpaces = normQuery.replace(/\s+/g, '');

  const cat = categories.find((c) => c.id === item.categoryId);

  // Collect all searchable strings for this item
  const allTexts = [
    item.titleFa || '',
    item.titleEn || '',
    item.description || '',
    ...(item.tags || []),
    ...(item.ingredients || []),
    ...(item.aromaNotes || []),
    cat?.nameFa || '',
    cat?.nameEn || '',
  ];

  // Common Persian aliases
  if (normQuery.includes('لته') || normQuery.includes('لاته')) {
    allTexts.push('لاته', 'لته', 'latte');
  }
  if (normQuery.includes('امریکانو') || normQuery.includes('آمریکانو')) {
    allTexts.push('امریکانو', 'آمریکانو', 'americano');
  }

  const combinedRaw = allTexts.join(' ').toLowerCase();
  const combinedNorm = normalizePersianText(combinedRaw);
  const combinedNoSpaces = combinedNorm.replace(/\s+/g, '');

  // 1. Direct raw or normalized containment
  if (combinedRaw.includes(rawQuery)) return true;
  if (combinedNorm.includes(normQuery)) return true;
  if (queryNoSpaces.length >= 2 && combinedNoSpaces.includes(queryNoSpaces)) return true;

  // 2. Word-by-word token matching (e.g. "قهوه سرد")
  const tokens = normQuery.split(' ').filter(Boolean);
  if (tokens.length > 1) {
    const allTokensMatch = tokens.every(
      (tok) => combinedNorm.includes(tok) || combinedNoSpaces.includes(tok)
    );
    if (allTokensMatch) return true;
  }

  return false;
}

// ==========================================
// MAIN MENU COMPONENT
// ==========================================
export function MenuSection({
  categories,
  items,
}: MenuSectionProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);

  // Horizontal scroll container ref for category cards
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Scroll categories left or right via button
  const handleScrollCategories = (direction: 'left' | 'right') => {
    const el = categoryScrollRef.current;
    if (!el) return;
    const scrollStep = 280;
    // In RTL, left is next, right is previous
    const leftVal = direction === 'left' ? -scrollStep : scrollStep;
    el.scrollBy({ left: leftVal, behavior: 'smooth' });
  };

  // Support mouse wheel horizontal scrolling over the cards
  const handleWheelCategories = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = categoryScrollRef.current;
    if (!el) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 6) {
      el.scrollLeft += e.deltaY;
    }
  };

  // Scroll clicked category card into view
  const handleSelectCategory = (catId: string, e?: React.MouseEvent) => {
    setActiveCategoryId(catId);
    if (e?.currentTarget) {
      (e.currentTarget as HTMLElement).scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // Search filter
  const isSearching = searchQuery.trim().length > 0;

  // Match items across the menu with smart Persian normalization
  const allMatchedItems = items.filter((item) =>
    itemMatchesSearch(item, categories, searchQuery)
  );

  const filteredItems = allMatchedItems;

  // When searching: search across the entire menu!
  const displayItems = isSearching
    ? (activeCategoryId === 'all' 
        ? allMatchedItems 
        : allMatchedItems.filter((item) => item.categoryId === activeCategoryId))
    : (activeCategoryId === 'all'
        ? items
        : items.filter((item) => item.categoryId === activeCategoryId));

  return (
    <section id="menu" className="py-8 sm:py-16 max-w-6xl mx-auto px-3.5 sm:px-6">
      
      {/* Header & Section Title with Design Mode Toggle */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5"
      >
        <div>
          <div className={`flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase mb-1 ${
            isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
          }`}>
            <span>منوی آنلاین کافه دال</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className={`tracking-wide text-[10px] sm:text-xs font-medium ${isEmerald ? 'text-[#A8BCB5]' : 'text-[#A2B2AC]'}`}>DALL MENU</span>
          </div>
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-[#F6F4EE] leading-tight">
            قهوه تخصصی، نوشیدنی‌ها و شیرینی‌ها
          </h2>
        </div>
      </motion.div>

      {/* Chic & Minimal Category Cards (طراحی کارتی و اسکرول‌پذیر دسته‌بندی‌ها) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${
              isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>دسته‌بندی‌های منو</span>
            </div>

            <span className="text-[10px] text-[#8EA39C] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/5 hidden sm:inline-block">
              اسکرول افقی ←
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeCategoryId !== 'all' && (
              <button
                onClick={() => setActiveCategoryId('all')}
                className={`text-[11px] font-semibold flex items-center gap-1 hover:underline active:scale-95 transition-all ml-1 ${
                  isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
                }`}
              >
                <span>مشاهده همه</span>
                <RotateCcw className="w-3 h-3" />
              </button>
            )}

            {/* Left and Right Scroll Buttons */}
            <div className="flex items-center gap-1 bg-black/25 p-0.5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => handleScrollCategories('right')}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                  isEmerald 
                    ? 'hover:bg-[#DFBA87] hover:text-[#1E170F] text-[#CCD7D2]' 
                    : 'hover:bg-[#C48B4C] hover:text-[#1B1107] text-[#CCD7D2]'
                }`}
                title="اسکرول به راست"
                aria-label="اسکرول به راست"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleScrollCategories('left')}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                  isEmerald 
                    ? 'hover:bg-[#DFBA87] hover:text-[#1E170F] text-[#CCD7D2]' 
                    : 'hover:bg-[#C48B4C] hover:text-[#1B1107] text-[#CCD7D2]'
                }`}
                title="اسکرول به چپ"
                aria-label="اسکرول به چپ"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Category Cards Track with touch, drag, wheel & smooth snap */}
        <div className="relative">

          {/* Horizontally scrollable flex container */}
          <div
            ref={categoryScrollRef}
            onWheel={handleWheelCategories}
            className="flex items-stretch gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2 pt-0.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 cursor-grab active:cursor-grabbing select-none"
            role="region"
            aria-label="نوار اسکرول افقی دسته‌بندی‌ها"
          >
            {/* 'All Items' Card */}
            <CategoryCard
              id="all"
              nameFa="همه آیتم‌ها"
              nameEn="ALL MENU"
              iconName="layers"
              count={filteredItems.length}
              isActive={activeCategoryId === 'all'}
              onClick={(e) => handleSelectCategory('all', e)}
              isEmerald={isEmerald}
            />

            {/* Dynamic Categories Cards */}
            {sortedCategories.map((cat) => {
              const count = filteredItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  nameFa={cat.nameFa}
                  nameEn={cat.nameEn}
                  iconName={cat.iconName}
                  count={count}
                  isActive={activeCategoryId === cat.id}
                  onClick={(e) => handleSelectCategory(cat.id, e)}
                  isEmerald={isEmerald}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Real-time Search Input Bar */}
      <div className="mb-5">
        <div className="relative max-w-md">
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#A2B2AC]">
            <Search className="w-4 h-4" />
          </div>

          <input
            id="menu-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (activeCategoryId !== 'all' && val.trim().length > 0) {
                setActiveCategoryId('all');
              }
            }}
            placeholder="جستجوی سریع در منو (اسپرسو، چیزکیک، سرد...)"
            className={`w-full pr-10 pl-10 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm placeholder-[#A2B2AC]/70 border transition-all outline-none ${
              isEmerald
                ? (isSearching 
                    ? 'bg-[#08221D] text-[#F6F4EE] border-[#DFBA87] ring-1 ring-[#DFBA87]/40' 
                    : 'bg-[#08221D] text-[#F6F4EE] border-[#1E4D41] hover:border-[#DFBA87]/60 focus:border-[#DFBA87] focus:ring-1 focus:ring-[#DFBA87]/30')
                : (isSearching 
                    ? 'bg-[#142623] text-[#F0EDE5] border-[#C48B4C] ring-1 ring-[#C48B4C]/40' 
                    : 'bg-[#142623] text-[#F0EDE5] border-[#2C443E] hover:border-[#C48B4C]/60 focus:border-[#C48B4C] focus:ring-1 focus:ring-[#C48B4C]/30')
            }`}
          />

          {isSearching && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#A2B2AC] hover:text-white"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {isSearching && (
          <div className="flex items-center justify-between text-xs text-[#A2B2AC] mt-2 pr-1">
            <div className="flex items-center gap-1.5">
              <span>نتایج برای:</span>
              <strong className="text-[#F0EDE5]">«{searchQuery}»</strong>
              <span className={`font-mono ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'}`}>
                ({filteredItems.length} قلم)
              </span>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className={`inline-flex items-center gap-1 text-[11px] underline ${
                isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>پاک کردن</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Category Filter Banner (if a specific category is selected) */}
      {activeCategoryId !== 'all' && (
        <div className={`mb-5 p-3 sm:p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
          isEmerald 
            ? 'bg-[#08221D]/90 border-[#1E4D41]' 
            : 'bg-[#122420]/90 border-[#29423C]'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEmerald ? 'bg-[#DFBA87]' : 'bg-[#C48B4C]'}`} />
            <span className="text-xs text-[#A8BCB5] font-medium">
              دسته‌بندی فعال:
            </span>
            <span className={`text-xs font-black ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'}`}>
              {sortedCategories.find(c => c.id === activeCategoryId)?.nameFa}
            </span>
            {sortedCategories.find(c => c.id === activeCategoryId)?.description && (
              <span className="hidden md:inline text-[11px] text-[#A8BCB5]/75 mr-2">
                — {sortedCategories.find(c => c.id === activeCategoryId)?.description}
              </span>
            )}
          </div>

          <button
            onClick={() => setActiveCategoryId('all')}
            className={`self-start sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 active:scale-95 ${
              isEmerald
                ? 'bg-black/30 border-[#DFBA87]/30 text-[#DFBA87] hover:bg-[#DFBA87] hover:text-[#1E170F]'
                : 'bg-black/30 border-[#C48B4C]/30 text-[#C48B4C] hover:bg-[#C48B4C] hover:text-[#1B1107]'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>مشاهده همه دسته‌ها</span>
          </button>
        </div>
      )}

      {/* Empty Search/Filter State */}
      {displayItems.length === 0 ? (
        <div className="py-14 text-center bg-[#10221E] border border-[#283F3A] rounded-2xl p-6 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#081815] border border-[#283F3A] flex items-center justify-center mx-auto mb-3 text-[#C48B4C]">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#F0EDE5] mb-1">
            {isSearching 
              ? `هیچ موردی مطابق با «${searchQuery}» پیدا نشد` 
              : 'موردی در این دسته‌بندی یافت نشد'}
          </h3>
          <p className="text-xs text-[#A2B2AC] mb-4">
            {isSearching 
              ? 'می‌توانید کلمه دیگری را جستجو کنید (مثلاً: لاته، چیزکیک، سرد، دسر) یا جستجو را پاک کنید.' 
              : 'می‌توانید دسته‌بندی دیگری را انتخاب کنید یا همه منو را مشاهده فرمایید.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategoryId('all');
            }}
            className="py-2 px-4 rounded-xl font-bold text-xs bg-[#C48B4C] hover:bg-[#DBA366] text-[#1B1107] active:scale-95 transition-all shadow-sm"
          >
            مشاهده کل منو
          </button>
        </div>
      ) : (
        /* Product Cards in Mobile Design (1 column on mobile, 2 columns on tablet/desktop) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {displayItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onSelect={(item) => setSelectedItemForModal(item)}
            />
          ))}
        </div>
      )}

      {/* Item Details Bottom Sheet Modal */}
      <ItemDetailModal
        item={selectedItemForModal}
        allItems={items}
        onClose={() => setSelectedItemForModal(null)}
        onSelectItem={(item) => setSelectedItemForModal(item)}
      />
    </section>
  );
}
