'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MenuSection } from '@/components/MenuSection';
import { AboutSection } from '@/components/AboutSection';
import { LocationAndContact } from '@/components/LocationAndContact';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { MobileBottomNav, NavSection } from '@/components/MobileBottomNav';
import { MobileDashboardHeader } from '@/components/MobileDashboardHeader';
import { DedicatedAdminDashboard } from '@/components/DedicatedAdminDashboard';
import { useTheme } from '@/components/ThemeContext';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_MENU_ITEMS, 
  DEFAULT_CAFE_INFO 
} from '@/lib/default-data';
import { Category, MenuItem, CafeInfo } from '@/types/menu';

const STORAGE_KEY_ITEMS = 'dall_cafe_menu_items_v6';
const STORAGE_KEY_CATEGORIES = 'dall_cafe_menu_categories_v6';
const STORAGE_KEY_CAFE_INFO = 'dall_cafe_info_v6';
const STORAGE_KEY_ADMIN_PIN = 'dall_cafe_admin_pin_v4';

export default function HomePage() {
  const router = useRouter();

  // Lazy initialize state directly from storage on first render for instant loading
  const [items, setItems] = useState<MenuItem[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_MENU_ITEMS;
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (savedItems) {
        const parsed: MenuItem[] = JSON.parse(savedItems);
        return parsed.map((it) => {
          const def = DEFAULT_MENU_ITEMS.find((d) => d.id === it.id);
          const updated = { ...it };
          if (!updated.flavorProfile && def?.flavorProfile) {
            updated.flavorProfile = def.flavorProfile;
          }
          if (!updated.pairingItemId && def?.pairingItemId) {
            updated.pairingItemId = def.pairingItemId;
            updated.pairingNote = def.pairingNote;
          }
          return updated;
        });
      }
    } catch (e) {
      console.error('Error reading items:', e);
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [cafeInfo, setCafeInfo] = useState<CafeInfo>(() => {
    if (typeof window === 'undefined') return DEFAULT_CAFE_INFO;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CAFE_INFO);
      return saved ? JSON.parse(saved) : DEFAULT_CAFE_INFO;
    } catch {
      return DEFAULT_CAFE_INFO;
    }
  });

  // Admin states initialized directly
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('dal_admin_session') === 'active';
    } catch {
      return false;
    }
  });

  const [isDedicatedAdminOpen, setIsDedicatedAdminOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.location.pathname === '/admin';
  });

  const saveItemsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOpenDedicatedAdmin = () => {
    setIsDedicatedAdminOpen(true);
    try {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ admin: true }, '', '/admin');
      }
    } catch {}
  };

  const handleCloseDedicatedAdmin = () => {
    setIsDedicatedAdminOpen(false);
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    } catch {}
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setIsDedicatedAdminOpen(window.location.pathname === '/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Save changes to localStorage with non-blocking async debounce
  const saveItemsToStorage = React.useCallback((newItems: MenuItem[]) => {
    setItems(newItems);
    if (saveItemsTimeoutRef.current) clearTimeout(saveItemsTimeoutRef.current);
    saveItemsTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
      } catch (e) {
        console.error('Error saving items:', e);
      }
    }, 40);
  }, []);

  const saveCategoriesToStorage = React.useCallback((newCats: Category[]) => {
    setCategories(newCats);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(newCats));
      } catch (e) {
        console.error('Error saving categories:', e);
      }
    }, 40);
  }, []);

  const saveCafeInfoToStorage = React.useCallback((newInfo: CafeInfo) => {
    setCafeInfo(newInfo);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CAFE_INFO, JSON.stringify(newInfo));
      } catch (e) {
        console.error('Error saving cafe info:', e);
      }
    }, 40);
  }, []);

  // Admin handlers
  const handleAdminLogin = React.useCallback((pin: string): boolean => {
    const savedPin = localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || '1234';
    if (pin === savedPin) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('dal_admin_session', 'active');
      } catch {}
      return true;
    }
    return false;
  }, []);

  const handleAdminLogout = React.useCallback(() => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('dal_admin_session');
  }, []);

  const handleSaveItem = React.useCallback((itemToSave: MenuItem) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === itemToSave.id);
      let updated: MenuItem[];
      if (existingIndex > -1) {
        updated = [...prevItems];
        updated[existingIndex] = itemToSave;
      } else {
        updated = [itemToSave, ...prevItems];
      }
      saveItemsToStorage(updated);
      return updated;
    });
  }, [saveItemsToStorage]);

  const handleDeleteItem = React.useCallback((itemId: string) => {
    setItems((prevItems) => {
      const updated = prevItems.filter((i) => i.id !== itemId);
      saveItemsToStorage(updated);
      return updated;
    });
  }, [saveItemsToStorage]);

  const handleSaveCategory = React.useCallback((categoryToSave: Category) => {
    setCategories((prevCategories) => {
      const existingIndex = prevCategories.findIndex((c) => c.id === categoryToSave.id);
      let updated: Category[];
      if (existingIndex > -1) {
        updated = [...prevCategories];
        updated[existingIndex] = categoryToSave;
      } else {
        updated = [...prevCategories, categoryToSave];
      }
      saveCategoriesToStorage(updated);
      return updated;
    });
  }, [saveCategoriesToStorage]);

  const handleDeleteCategory = React.useCallback((categoryId: string) => {
    setCategories((prevCategories) => {
      const updatedCats = prevCategories.filter((c) => c.id !== categoryId);
      saveCategoriesToStorage(updatedCats);
      return updatedCats;
    });
  }, [saveCategoriesToStorage]);

  const handleResetToDefaults = React.useCallback(() => {
    saveItemsToStorage(DEFAULT_MENU_ITEMS);
    saveCategoriesToStorage(DEFAULT_CATEGORIES);
    saveCafeInfoToStorage(DEFAULT_CAFE_INFO);
  }, [saveItemsToStorage, saveCategoriesToStorage, saveCafeInfoToStorage]);

  const handleImportData = React.useCallback((data: { items: MenuItem[]; categories: Category[]; cafeInfo: CafeInfo }) => {
    saveItemsToStorage(data.items);
    saveCategoriesToStorage(data.categories);
    if (data.cafeInfo) {
      saveCafeInfoToStorage(data.cafeInfo);
    }
  }, [saveItemsToStorage, saveCategoriesToStorage, saveCafeInfoToStorage]);

  // Smooth scroll helper for main page navigation with responsive fixed header compensation
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = typeof window !== 'undefined' && window.innerWidth < 768 ? 116 : 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const { theme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  // If fallback admin view is open in the same page
  if (isDedicatedAdminOpen) {
    return (
      <DedicatedAdminDashboard
        isAdminLoggedIn={isAdminLoggedIn}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        items={items}
        categories={categories}
        cafeInfo={cafeInfo}
        onSaveItem={handleSaveItem}
        onDeleteItem={handleDeleteItem}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onSaveCafeInfo={saveCafeInfoToStorage}
        onResetToDefaults={handleResetToDefaults}
        onImportData={handleImportData}
        onBackToMenu={handleCloseDedicatedAdmin}
      />
    );
  }

  return (
    <>
      {/* Main Page Layout Container (with bottom padding for mobile quick nav) */}
      <div className={`min-h-screen flex flex-col transition-colors duration-300 pb-20 md:pb-6 ${
        isEmerald 
          ? 'bg-[#051A15] text-[#F6F4EE] selection:bg-[#DFBA87] selection:text-[#1E170F]' 
          : 'bg-[#071513] text-[#F0EDE5] selection:bg-[#C48B4C] selection:text-[#1B1107]'
      }`}>
        
        {/* Top Header Navbar (Desktop - Fixed at Top) */}
        <div className="hidden md:block">
          <Header
            onOpenAdmin={handleOpenDedicatedAdmin}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        </div>

        {/* Mobile Header (Mobile View - Fixed at Top) */}
        <div className="block md:hidden">
          <MobileDashboardHeader
            cafeInfo={cafeInfo}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdmin={handleOpenDedicatedAdmin}
            onOpenInfo={() => handleScrollToSection('routing')}
          />
        </div>

        {/* Top Spacer to account for Fixed Headers (Mobile ~112px, Desktop ~72px) */}
        <div className="h-[112px] md:h-[72px] shrink-0" aria-hidden="true" />

        {/* Main Content - Everything is sequentially present on the main page */}
        <main className="flex-1 space-y-4">
          {/* Hero Banner (Compact on mobile, full on desktop) */}
          <Hero cafeInfo={cafeInfo} />

          {/* Digital Online Menu Section (View-only on main page, changes only via admin panel) */}
          <div id="menu">
            <MenuSection
              categories={categories}
              items={items}
            />
          </div>

          {/* Cafe Information: Philosophy & Story */}
          <div id="about">
            <AboutSection cafeInfo={cafeInfo} />
          </div>

          {/* Cafe Location, Working Hours & Direct Contact */}
          <div id="routing">
            <LocationAndContact cafeInfo={cafeInfo} />
          </div>
        </main>

        {/* Footer (Rendered on customer view) */}
        <Footer
          cafeInfo={cafeInfo}
          onOpenAdmin={handleOpenDedicatedAdmin}
          isAdminLoggedIn={isAdminLoggedIn}
        />

        {/* Floating Scroll To Top Button */}
        <ScrollToTop />
      </div>

      {/* Mobile Bottom Navigation with main page sections */}
      <MobileBottomNav
        onSelectSection={(section: NavSection) => {
          handleScrollToSection(section);
        }}
      />
    </>
  );
}
