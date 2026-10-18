'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'new-emerald' | 'classic-dark';

export interface ThemeMeta {
  id: ThemeMode;
  name: 'Royal Pine Emerald' | 'Classic Cognac';
  nameFa: string;
  accent: string;
  bg: string;
  border: string;
  description: string;
}

export const THEMES: Record<ThemeMode, ThemeMeta> = {
  'new-emerald': {
    id: 'new-emerald',
    name: 'Royal Pine Emerald',
    nameFa: 'سبز زمردی و طلای شامپاینی',
    accent: '#DFBA87',
    bg: '#051A15',
    border: '#1A443A',
    description: 'تم اختصاصی کافه دال با تم رنگی زمردی سلطنتی و نقوش شامپاینی',
  },
  'classic-dark': {
    id: 'classic-dark',
    name: 'Classic Cognac',
    nameFa: 'کنیاک کهربایی و گردویی',
    accent: '#C48B4C',
    bg: '#071513',
    border: '#1E3D37',
    description: 'تم کلاسیک با ترکیب رنگ کهربایی اصیل، چوب گردو و سبز جنگلی تیره',
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'new-emerald',
  setTheme: () => {},
  toggleTheme: () => {},
});

const STORAGE_KEY = 'dall_cafe_theme_mode_v5';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('new-emerald');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'new-emerald');
    try {
      localStorage.setItem(STORAGE_KEY, 'new-emerald');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'new-emerald' ? 'classic-dark' : 'new-emerald';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
