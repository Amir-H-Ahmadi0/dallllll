'use client';

import React, { useState } from 'react';
import { CafeInfo } from '@/types/menu';
import { 
  MapPin, 
  Phone, 
  Instagram, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Navigation,
  MessageCircle,
  Send 
} from 'lucide-react';
import { DalLogo } from './DalLogo';
import { motion } from 'motion/react';
import { useTheme } from './ThemeContext';

interface LocationAndContactProps {
  cafeInfo: CafeInfo;
}

export function LocationAndContact({ cafeInfo }: LocationAndContactProps) {
  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';
  const [copied, setCopied] = useState(false);

  // Exact coordinates of Dall Cafe in Isfahan (Chaharbagh Abbasi area)
  const lat = cafeInfo.coordinates?.lat || 32.6546;
  const lng = cafeInfo.coordinates?.lng || 51.6676;

  // Direct map routing links
  const neshanLink = `https://neshan.org/maps/@${lat},${lng},16z`;
  const baladLink = `https://balad.ir/location?latitude=${lat}&longitude=${lng}`;
  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const wazeLink = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  // Clean OpenStreetMap embed iframe
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.007}%2C${lat - 0.005}%2C${lng + 0.007}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(cafeInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="routing" className="py-10 sm:py-16 md:py-20 max-w-6xl mx-auto px-3.5 sm:px-6">
      
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-[#C48B4C] uppercase mb-2">
          <span>دسترسی و موقعیت</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="tracking-wider text-[10px] sm:text-xs font-medium text-[#A2B2AC]">FIND DALL</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#F0EDE5] mb-2 sm:mb-3 leading-tight">
          مسیریابی و حضور در کافه دال
        </h2>

        <p className="text-xs sm:text-sm text-[#CCD7D2] leading-relaxed">
          در محیطی آرام و صمیمی در قلب شهر، مشتاق میزبانی و همراهی لحظات مکث شما هستیم.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Interactive Map + Navigation Apps (7 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="lg:col-span-7 bg-[#142320] border border-[#2B413B] rounded-2xl overflow-hidden shadow-lg"
        >
          
          {/* Map View Frame */}
          <div className="relative w-full h-72 sm:h-96 bg-[#071513] overflow-hidden">
            <iframe
              title="نقشه موقعیت کافه دال"
              src={mapEmbedUrl}
              className="w-full h-full border-0 filter grayscale-[40%] contrast-110"
              loading="lazy"
            />

            {/* Custom Brand Pin Overlay Card with Wood & Slate Accent */}
            <div className={`absolute top-4 right-4 backdrop-blur-md rounded-xl p-3 shadow-xl flex items-center gap-3 border ${
              isEmerald 
                ? 'bg-[#08221D]/95 border-[#1E4D41]' 
                : 'bg-[#142421]/95 border-[#384F49]'
            }`}>
              <div className="w-9 h-9 rounded-full shrink-0 aspect-square flex items-center justify-center p-0.5">
                <DalLogo size="sm" showText={false} circular={true} className="w-full h-full" />
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[#F6F4EE]">کافه دال</div>
                <div className={`text-[10px] font-medium ${isEmerald ? 'text-[#DFBA87]' : 'text-[#C48B4C]'}`}>
                  جایی برای مکث
                </div>
              </div>
            </div>
          </div>

          {/* Quick Routing Apps Selector in Concrete Slate Gray */}
          <div className="p-4 sm:p-5 bg-[#172724] border-t border-[#2B413B]">
            <div className="text-xs font-bold text-[#F0EDE5] mb-3 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#C48B4C]" />
              <span>مسیریابی مستقیم با یک کلیک:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Neshan */}
              <a
                href={neshanLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#20312D] hover:bg-[#C48B4C] hover:text-[#1B1107] text-[#F0EDE5] border border-[#384F49] text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs group"
              >
                <span>نشان (Neshan)</span>
                <ExternalLink className="w-3 h-3 text-[#A2B2AC] group-hover:text-[#1B1107]" />
              </a>

              {/* Balad */}
              <a
                href={baladLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#20312D] hover:bg-[#C48B4C] hover:text-[#1B1107] text-[#F0EDE5] border border-[#384F49] text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs group"
              >
                <span>بلد (Balad)</span>
                <ExternalLink className="w-3 h-3 text-[#A2B2AC] group-hover:text-[#1B1107]" />
              </a>

              {/* Google Maps */}
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#20312D] hover:bg-[#C48B4C] hover:text-[#1B1107] text-[#F0EDE5] border border-[#384F49] text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs group"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3 text-[#A2B2AC] group-hover:text-[#1B1107]" />
              </a>

              {/* Waze */}
              <a
                href={wazeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#20312D] hover:bg-[#C48B4C] hover:text-[#1B1107] text-[#F0EDE5] border border-[#384F49] text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-xs group"
              >
                <span>ویز (Waze)</span>
                <ExternalLink className="w-3 h-3 text-[#A2B2AC] group-hover:text-[#1B1107]" />
              </a>
            </div>
          </div>

        </motion.div>

        {/* Right / Contact & Hours in Concrete Slate Gray Panels (5 cols) */}
        <motion.div 
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          id="contact" 
          className="lg:col-span-5 space-y-4"
        >
          
          {/* Address Box */}
          <div className="bg-[#172724] border border-[#2E433E] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F0EDE5]">
                <MapPin className="w-4 h-4 text-[#C48B4C]" />
                <span>آدرس کافه</span>
              </div>
              <button
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#20312D] hover:bg-[#283E39] text-[#F0EDE5] hover:text-white border border-[#384F49] hover:border-[#C48B4C]/50 active:scale-95 text-[11px] font-bold transition-all duration-200 shadow-xs"
                title="کپی آدرس در کلیپ‌بورد"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">کپی شد!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#C48B4C]" />
                    <span>کپی آدرس</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#CCD7D2] leading-relaxed">
              {cafeInfo.address}
            </p>
          </div>

          {/* Working Hours */}
          <div className="bg-[#172724] border border-[#2E433E] rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#F0EDE5] mb-2.5 sm:mb-3">
              <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#C48B4C]" />
              <span>ساعات کاری کافه دال</span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1 border-b border-[#2B413B]">
                <span className="text-[#A2B2AC]">شنبه تا چهارشنبه</span>
                <span className="text-[#F0EDE5] font-semibold tabular-nums">۸:۰۰ — ۲۳:۳۰</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#A2B2AC]">پنج‌شنبه و جمعه</span>
                <span className="text-[#F0EDE5] font-semibold tabular-nums">۸:۳۰ — ۲۴:۰۰ بامداد</span>
              </div>
            </div>
          </div>

          {/* Direct Communication Channels (Phone, Instagram, WhatsApp, Telegram) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Phone */}
            <a
              href={`tel:${cafeInfo.phone.replace(/[^0-9]/g, '')}`}
              className="bg-[#172724] hover:bg-[#1E312D] border border-[#2E433E] rounded-xl p-3.5 transition-all flex items-center gap-3 group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-[#20312D] border border-[#384F49] flex items-center justify-center text-[#F0EDE5] group-hover:bg-[#C48B4C] group-hover:text-[#1B1107] transition-colors shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-right min-w-0">
                <div className="text-[10px] text-[#A2B2AC]">تماس تلفنی و رزرو</div>
                <div className="text-xs sm:text-sm font-bold text-[#F0EDE5] tabular-nums dir-ltr truncate">
                  {cafeInfo.phone}
                </div>
              </div>
            </a>

            {/* Instagram */}
            {cafeInfo.instagram && (
              <a
                href={`https://instagram.com/${cafeInfo.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#172724] hover:bg-[#1E312D] border border-[#2E433E] rounded-xl p-3.5 transition-all flex items-center gap-3 group shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-[#20312D] border border-[#384F49] flex items-center justify-center text-[#F0EDE5] group-hover:bg-[#C48B4C] group-hover:text-[#1B1107] transition-colors shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-[10px] text-[#A2B2AC]">اینستاگرام کافه دال</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F0EDE5] dir-ltr truncate">
                    @{cafeInfo.instagram.replace('@', '')}
                  </div>
                </div>
              </a>
            )}

            {/* WhatsApp */}
            {cafeInfo.whatsapp && (
              <a
                href={`https://wa.me/${cafeInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#172724] hover:bg-[#1E312D] border border-[#2E433E] rounded-xl p-3.5 transition-all flex items-center gap-3 group shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-[#20312D] border border-[#384F49] flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-[#10221E] transition-colors shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-[10px] text-[#A2B2AC]">پیام در واتس‌اپ</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F0EDE5] dir-ltr truncate">
                    {cafeInfo.whatsapp}
                  </div>
                </div>
              </a>
            )}

            {/* Telegram */}
            {cafeInfo.telegram && (
              <a
                href={`https://t.me/${cafeInfo.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#172724] hover:bg-[#1E312D] border border-[#2E433E] rounded-xl p-3.5 transition-all flex items-center gap-3 group shadow-xs"
              >
                <div className="w-9 h-9 rounded-lg bg-[#20312D] border border-[#384F49] flex items-center justify-center text-[#229ED9] group-hover:bg-[#229ED9] group-hover:text-white transition-colors shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div className="text-right min-w-0">
                  <div className="text-[10px] text-[#A2B2AC]">کانال و ارتباط تلگرام</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F0EDE5] dir-ltr truncate">
                    @{cafeInfo.telegram.replace('@', '')}
                  </div>
                </div>
              </a>
            )}
          </div>

        </motion.div>

      </div>
    </section>
  );
}
