'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DedicatedAdminDashboard } from '@/components/DedicatedAdminDashboard';
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

export default function AdminPage() {
  const router = useRouter();

  // Lazy initialize state directly from storage on first render
  const [items, setItems] = useState<MenuItem[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_MENU_ITEMS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      return saved ? JSON.parse(saved) : DEFAULT_MENU_ITEMS;
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
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

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem('dal_admin_session') === 'active';
    } catch {
      return false;
    }
  });

  const saveItemsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Save changes to localStorage with non-blocking async debounce
  const saveItemsToStorage = React.useCallback((newItems: MenuItem[]) => {
    setItems(newItems);
    if (saveItemsTimeoutRef.current) clearTimeout(saveItemsTimeoutRef.current);
    saveItemsTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
      } catch (e) {}
    }, 40);
  }, []);

  const saveCategoriesToStorage = React.useCallback((newCats: Category[]) => {
    setCategories(newCats);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(newCats));
      } catch (e) {}
    }, 40);
  }, []);

  const saveCafeInfoToStorage = React.useCallback((newInfo: CafeInfo) => {
    setCafeInfo(newInfo);
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CAFE_INFO, JSON.stringify(newInfo));
      } catch (e) {}
    }, 40);
  }, []);

  const handleAdminLogin = React.useCallback((pin: string): boolean => {
    const savedPin = localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || '1234';
    if (pin === savedPin) {
      setIsAdminLoggedIn(true);
      try {
        sessionStorage.setItem('dal_admin_session', 'active');
      } catch (e) {}
      return true;
    }
    return false;
  }, []);

  const handleAdminLogout = React.useCallback(() => {
    setIsAdminLoggedIn(false);
    try {
      sessionStorage.removeItem('dal_admin_session');
    } catch (e) {}
  }, []);

  const handleSaveItem = React.useCallback((itemToSave: MenuItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === itemToSave.id);
      let updated: MenuItem[];
      if (exists) {
        updated = prev.map((i) => (i.id === itemToSave.id ? itemToSave : i));
      } else {
        updated = [itemToSave, ...prev];
      }
      saveItemsToStorage(updated);
      return updated;
    });
  }, [saveItemsToStorage]);

  const handleDeleteItem = React.useCallback((itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveItemsToStorage(updated);
      return updated;
    });
  }, [saveItemsToStorage]);

  const handleSaveCategory = React.useCallback((catToSave: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === catToSave.id);
      let updated: Category[];
      if (exists) {
        updated = prev.map((c) => (c.id === catToSave.id ? catToSave : c));
      } else {
        updated = [...prev, catToSave];
      }
      saveCategoriesToStorage(updated);
      return updated;
    });
  }, [saveCategoriesToStorage]);

  const handleDeleteCategory = React.useCallback((categoryId: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== categoryId);
      saveCategoriesToStorage(updated);
      return updated;
    });
  }, [saveCategoriesToStorage]);

  const handleResetToDefaults = React.useCallback(() => {
    setItems(DEFAULT_MENU_ITEMS);
    setCategories(DEFAULT_CATEGORIES);
    setCafeInfo(DEFAULT_CAFE_INFO);
    try {
      localStorage.removeItem(STORAGE_KEY_ITEMS);
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      localStorage.removeItem(STORAGE_KEY_CAFE_INFO);
    } catch (e) {}
  }, []);

  const handleImportData = React.useCallback((data: { items: MenuItem[]; categories: Category[]; cafeInfo: CafeInfo }) => {
    saveItemsToStorage(data.items);
    saveCategoriesToStorage(data.categories);
    if (data.cafeInfo) {
      saveCafeInfoToStorage(data.cafeInfo);
    }
  }, [saveItemsToStorage, saveCategoriesToStorage, saveCafeInfoToStorage]);

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
      onBackToMenu={() => router.push('/')}
    />
  );
}
