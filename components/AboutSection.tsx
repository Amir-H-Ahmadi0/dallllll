'use client';

import React from 'react';
import { DalLogo } from './DalLogo';
import { CafeInfo } from '@/types/menu';
import { Coffee, Sparkles, HeartHandshake, Instagram, MessageCircle, Send, Phone, ExternalLink, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';

interface AboutSectionProps {
  cafeInfo: CafeInfo;
}

export function AboutSection({ cafeInfo }: AboutSectionProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  return (
    <section 
      id="about" 
      className={`py-10 sm:py-16 md:py-20 border-y relative overflow-hidden transition-colors duration-300 wood-slat-subtle ${
        isEmerald 
          ? 'bg-[#061D17] border-[#1A443A]' 
          : 'bg-[#0E1E1B] border-[#233833]'
      }`}
    >
      
      {/* Soft intimate ambient glow */}
      <div 
        className={`absolute bottom-0 right-0 w-80 h-80 blur-[130px] rounded-full pointer-events-none -z-10 ${
          isEmerald ? 'bg-[#DFBA87]/10' : 'bg-[#C48B4C]/10'
        }`} 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-0 left-0 w-80 h-80 bg-[#071513]/90 blur-[130px] rounded-full pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-[#C48B4C] uppercase mb-2">
            <span>فلسفه و هویت دال</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="text-[#A2B2AC] tracking-wider text-[10px] sm:text-xs font-medium">ABOUT DALL</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F0EDE5] mb-2 sm:mb-3 leading-tight">
            فرصتی برای یک درنگ دلنشین
          </h2>

          <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
            <span className="h-[1px] w-8 sm:w-12 bg-[#C48B4C]/40" />
            <span className="text-xs sm:text-sm font-bold text-[#F0EDE5]">
              جایی که کیفیت و آرامش به هم می‌رسند
            </span>
            <span className="h-[1px] w-8 sm:w-12 bg-[#C48B4C]/40" />
          </div>
        </motion.div>

        {/* Narrative & Visual Brand Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Visual Brand Card with Slate & Walnut Trim (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className={`relative w-full max-w-sm aspect-square rounded-2xl p-6 sm:p-8 border flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-300 wood-glow ${
              isEmerald 
                ? 'bg-[#08221D] border-[#1E4D41] text-[#F6F4EE]' 
                : 'bg-[#142421] border-[#384F49] text-[#F0EDE5]'
            }`}>
              
              {/* Monogram within frame - strictly aspect-square shrink-0 */}
              <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl mb-4 shadow-md flex items-center justify-center p-3 shrink-0 aspect-square border ${
                isEmerald 
                  ? 'bg-[#051915] border-[#DFBA87]/40' 
                  : 'bg-[#081715] border-[#C48B4C]/50'
              }`}>
                <DalLogo size="lg" showText={true} circular={true} className="w-full h-full" />
              </div>

              <div className="text-2xl sm:text-3xl font-black mb-1">
                کافه دال
              </div>
              <div className={`text-[9.5px] sm:text-[11px] uppercase font-bold mb-3 tracking-wider ${
                isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
              }`}>
                DALL CAFÉ · EST. 2024
              </div>

              <div className={`text-[10.5px] sm:text-xs font-medium border-t pt-2.5 sm:pt-3 w-full flex items-center justify-center gap-1.5 sm:gap-2 ${
                isEmerald 
                  ? 'border-[#1E4D41] text-[#CAD6D2]' 
                  : 'border-[#2D433E] text-[#CCD7D2]'
              }`}>
                <span>{cafeInfo.slogan}</span>
                <span>·</span>
                <span className="tracking-wide text-[9.5px] sm:text-xs">A PLACE TO PAUSE</span>
              </div>
            </div>
          </motion.div>

          {/* Narrative Text & 3 Experience Pillars (7 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-3 sm:space-y-4 text-right"
          >
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#F0EDE5]">
              داستان یک فنجان قهوه، بدون عجله
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-[#CCD7D2] font-normal leading-relaxed">
              {cafeInfo.aboutText}
            </p>

            <p className="text-xs sm:text-sm text-[#A2B2AC] font-normal leading-relaxed">
              «دال» تنها یک نام نیست؛ نمادی از نقطه‌گذاری و مکث در جریان پرشتاب زندگی است.
              ما محیطی صمیمی و دلنشین ساخته‌ایم که در آن بوی خوش دانه‌های برشته‌شده قهوه،
              نور ملایم و صمیمیت گفت‌وگو، پناهگاهی امن برای لحظات شخصی یا دیدارهای دوستانه شما باشد.
            </p>

            {/* Three Experiential Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
              {/* Specialty Coffee */}
              <div className="p-3.5 rounded-xl bg-[#142421] border border-[#344A44] hover:border-[#C48B4C]/60 transition-colors text-right shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[#0E1A17] border border-[#384F49] flex items-center justify-center text-[#C48B4C] mb-2 shadow-xs">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#F0EDE5] mb-0.5">قهوه تخصصی</h4>
                <p className="text-[11px] text-[#A2B2AC] leading-relaxed">دانه‌های منتخب و عصاره‌گیری دقیق</p>
              </div>

              {/* Serene Atmosphere */}
              <div className="p-3.5 rounded-xl bg-[#142421] border border-[#344A44] hover:border-[#C48B4C]/60 transition-colors text-right shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[#0E1A17] border border-[#384F49] flex items-center justify-center text-[#C48B4C] mb-2 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#F0EDE5] mb-0.5">اتمسفر آرام</h4>
                <p className="text-[11px] text-[#A2B2AC] leading-relaxed">فضایی دنج با نورپردازی گرم</p>
              </div>

              {/* Handcrafted Pastry */}
              <div className="p-3.5 rounded-xl bg-[#142421] border border-[#344A44] hover:border-[#C48B4C]/60 transition-colors text-right shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-[#0E1A17] border border-[#384F49] flex items-center justify-center text-[#C48B4C] mb-2 shadow-xs">
                  <HeartHandshake className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold text-[#F0EDE5] mb-0.5">میزبانی صمیمانه</h4>
                <p className="text-[11px] text-[#A2B2AC] leading-relaxed">توجه به آرامش و رضایت شما</p>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Social Media & Customer Connection Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          className={`mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl border transition-colors shadow-lg ${
            isEmerald 
              ? 'bg-[#08221D]/85 border-[#1E4D41]' 
              : 'bg-[#142421]/85 border-[#2D433E]'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="text-right max-w-xl">
              <div className={`flex items-center gap-2 text-xs font-bold uppercase mb-1.5 ${
                isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'
              }`}>
                <Share2 className="w-3.5 h-3.5" />
                <span>پل‌های ارتباطی و شبکه‌های اجتماعی</span>
                <span className="opacity-40">·</span>
                <span className="tracking-en opacity-80">STAY CONNECTED</span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-[#F6F4EE]">
                همراه با کافه دال در فضای مجازی
              </h4>
              <p className="text-xs text-[#A8BCB5] mt-1 leading-relaxed">
                برای مشاهده حال‌وهوای روزانه کافه، منوی ویژه فصلی، ارسال نظرات و رزرو، از طریق بسترهای زیر در کنار شما هستیم.
              </p>
            </div>

            {/* Social Links Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Instagram */}
              {cafeInfo.instagram && (
                <a
                  href={`https://instagram.com/${cafeInfo.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm group ${
                    isEmerald
                      ? 'bg-[#0B251E] hover:bg-[#DFBA87] text-[#F6F4EE] hover:text-[#1E170F] border-[#1E483D] hover:border-[#DFBA87]'
                      : 'bg-[#10221E] hover:bg-[#C48B4C] text-[#F0EDE5] hover:text-[#1B1107] border-[#2C443E] hover:border-[#C48B4C]'
                  }`}
                >
                  <Instagram className={`w-4 h-4 ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'} group-hover:text-inherit transition-colors`} />
                  <span>اینستاگرام</span>
                  <span className="text-[10px] opacity-75 font-mono dir-ltr">@{cafeInfo.instagram.replace('@', '')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              )}

              {/* WhatsApp */}
              {cafeInfo.whatsapp && (
                <a
                  href={`https://wa.me/${cafeInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm group ${
                    isEmerald
                      ? 'bg-[#0B251E] hover:bg-[#25D366] text-[#F6F4EE] hover:text-[#0B251E] border-[#1E483D] hover:border-[#25D366]'
                      : 'bg-[#10221E] hover:bg-[#25D366] text-[#F0EDE5] hover:text-[#10221E] border-[#2C443E] hover:border-[#25D366]'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-inherit transition-colors" />
                  <span>واتس‌اپ</span>
                  <span className="text-[10px] opacity-75 font-mono dir-ltr">{cafeInfo.whatsapp}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              )}

              {/* Telegram */}
              {cafeInfo.telegram && (
                <a
                  href={`https://t.me/${cafeInfo.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm group ${
                    isEmerald
                      ? 'bg-[#0B251E] hover:bg-[#229ED9] text-[#F6F4EE] hover:text-white border-[#1E483D] hover:border-[#229ED9]'
                      : 'bg-[#10221E] hover:bg-[#229ED9] text-[#F0EDE5] hover:text-white border-[#2C443E] hover:border-[#229ED9]'
                  }`}
                >
                  <Send className="w-4 h-4 text-[#229ED9] group-hover:text-white transition-colors" />
                  <span>تلگرام</span>
                  <span className="text-[10px] opacity-75 font-mono dir-ltr">@{cafeInfo.telegram.replace('@', '')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              )}

              {/* Phone Direct */}
              {cafeInfo.phone && (
                <a
                  href={`tel:${cafeInfo.phone.replace(/[^0-9]/g, '')}`}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm group ${
                    isEmerald
                      ? 'bg-[#0B251E] hover:bg-[#0F3027] text-[#F6F4EE] border-[#1E483D] hover:border-[#DFBA87]'
                      : 'bg-[#10221E] hover:bg-[#152B26] text-[#F0EDE5] border-[#2C443E] hover:border-[#C48B4C]'
                  }`}
                >
                  <Phone className={`w-4 h-4 ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'} group-hover:text-inherit transition-colors`} />
                  <span>تماس مستقیم</span>
                  <span className="text-[10px] opacity-75 font-mono dir-ltr">{cafeInfo.phone}</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
