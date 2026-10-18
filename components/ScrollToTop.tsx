'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 md:bottom-6 left-4 md:left-6 z-35 p-3 rounded-full bg-[#102421] hover:bg-[#C48B4C] text-[#C48B4C] hover:text-[#1B1107] shadow-xl border border-[#2D453F] hover:border-[#C48B4C] transition-all duration-300 transform flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-[#C48B4C] active:scale-90 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="برگشت به بالای صفحه"
      title="برگشت به بالای صفحه"
    >
      <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 duration-200" />
      <span className="sr-only">برگشت به بالا</span>
    </button>
  );
}
