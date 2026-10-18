'use client';

import React, { useState, useRef, useMemo, useCallback, useDeferredValue, useEffect } from 'react';
import { MenuItem, Category, CafeInfo, FlavorProfile } from '@/types/menu';
import { formatPrice } from '@/lib/formatters';
import { 
  Lock, 
  Unlock, 
  Coffee, 
  Layers, 
  Plus, 
  Check, 
  X, 
  Search, 
  Edit, 
  Trash2,
  Copy,
  RotateCcw, 
  Settings, 
  Download, 
  Upload,
  Phone, 
  Clock, 
  AlertCircle,
  Eye,
  EyeOff,
  Store,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Flame,
  CupSoda,
  Utensils,
  Sandwich,
  Zap,
  Droplets,
  Heart,
  Image as ImageIcon,
  CheckCircle2,
  LayoutDashboard,
  Tag,
  DollarSign,
  Share2,
  Palette
} from 'lucide-react';
import { DalLogo } from './DalLogo';
import { isFlavorProfileCategory } from './FlavorProfileBar';
import { useTheme } from './ThemeContext';

export type AdminDashboardSection = 
  | 'overview' 
  | 'items' 
  | 'quick-stock' 
  | 'quick-prices' 
  | 'categories' 
  | 'cafe-info' 
  | 'backup';

interface DedicatedAdminDashboardProps {
  isAdminLoggedIn: boolean;
  onLogin: (pin: string) => boolean;
  onLogout: () => void;
  items: MenuItem[];
  categories: Category[];
  cafeInfo: CafeInfo;
  onSaveItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onSaveCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSaveCafeInfo: (info: CafeInfo) => void;
  onResetToDefaults: () => void;
  onImportData: (data: { items: MenuItem[]; categories: Category[]; cafeInfo: CafeInfo }) => void;
  onBackToMenu: () => void;
  initialSection?: AdminDashboardSection;
  initialEditingItem?: MenuItem | null;
}

// Category Icons
const CATEGORY_ICON_OPTIONS = [
  { id: 'Coffee', label: 'قهوه / اسپرسو', icon: Coffee },
  { id: 'Flame', label: 'بار گرم / دمی', icon: Flame },
  { id: 'Sparkles', label: 'بار سرد / ویژه', icon: Sparkles },
  { id: 'Leaf', label: 'ماچا / گیاهی', icon: CupSoda },
  { id: 'CupSoda', label: 'چای / شربت', icon: CupSoda },
  { id: 'Utensils', label: 'شیرینی / کیک', icon: Utensils },
  { id: 'Sandwich', label: 'صبحانه / اسنک', icon: Sandwich },
];

const renderCatIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName?.toLowerCase()) {
    case 'flame': return <Flame className={className} />;
    case 'sparkles': return <Sparkles className={className} />;
    case 'cupsoda': return <CupSoda className={className} />;
    case 'utensils': return <Utensils className={className} />;
    case 'sandwich': return <Sandwich className={className} />;
    case 'coffee':
    default: return <Coffee className={className} />;
  }
};

// Flavor Profiles Config
const FLAVOR_CONFIGS: {
  key: keyof FlavorProfile;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  levels: { [val: number]: string };
}[] = [
  {
    key: 'caffeine',
    label: 'کافئین (Caffeine)',
    icon: Zap,
    levels: { 0: 'بدون کافئین', 1: 'بسیار کم', 2: 'ملایم', 3: 'متوسط', 4: 'پرکافئین', 5: 'بسیار بالا' },
  },
  {
    key: 'body',
    label: 'بافت و غلظت (Body)',
    icon: Droplets,
    levels: { 0: 'نامشخص', 1: 'بسیار سبک', 2: 'سبک', 3: 'متوسط', 4: 'غلیظ', 5: 'مخملی' },
  },
  {
    key: 'acidity',
    label: 'اسیدیته و طراوت (Acidity)',
    icon: Sparkles,
    levels: { 0: 'بدون اسیدیته', 1: 'بسیار کم', 2: 'ملایم', 3: 'متعادل', 4: 'میوه‌ای', 5: 'برجسته' },
  },
  {
    key: 'bitterness',
    label: 'تلخی (Bitterness)',
    icon: Coffee,
    levels: { 0: 'نامحسوس', 1: 'بسیار کم', 2: 'ملایم', 3: 'شکلاتی', 4: 'عمیق', 5: 'بسیار تلخ' },
  },
  {
    key: 'sweetness',
    label: 'شیرینی ذاتی (Sweetness)',
    icon: Heart,
    levels: { 0: 'خشک', 1: 'بسیار کم', 2: 'طبیعی کم', 3: 'متعادل', 4: 'کاراملی', 5: 'بارز' },
  },
];

// Image optimize helper
const optimizeImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 900;
        const maxHeight = 900;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface QuickPriceRowProps {
  item: MenuItem;
  categoryName?: string;
  onSavePrice: (item: MenuItem, newPrice: number) => void;
}

const QuickPriceRow = React.memo(function QuickPriceRow({
  item,
  categoryName,
  onSavePrice,
}: QuickPriceRowProps) {
  const [localPrice, setLocalPrice] = useState(item.price);
  const [prevPrice, setPrevPrice] = useState(item.price);

  if (item.price !== prevPrice) {
    setPrevPrice(item.price);
    setLocalPrice(item.price);
  }

  const isModified = localPrice !== item.price;

  return (
    <div className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
      <div className="min-w-0 text-right flex-1">
        <h4 className="text-xs sm:text-sm font-bold text-white break-words leading-snug">
          {item.titleFa}
        </h4>
        <span className="text-[10.5px] text-[#8EA39C] break-words block mt-0.5">
          {categoryName}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10">
          <input
            type="number"
            step="1000"
            value={localPrice}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setLocalPrice(isNaN(val) ? 0 : val);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isModified) {
                onSavePrice(item, localPrice);
              }
            }}
            className="w-24 text-center text-xs font-black text-[#DFBA87] bg-transparent focus:outline-none tabular-nums"
          />
          <span className="text-[10px] text-[#8EA39C]">تومان</span>
        </div>

        {isModified && (
          <button
            onClick={() => onSavePrice(item, localPrice)}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>ذخیره</span>
          </button>
        )}
      </div>
    </div>
  );
});

interface QuickStockCardProps {
  item: MenuItem;
  categoryName?: string;
  isEmerald: boolean;
  onToggleStock: (item: MenuItem) => void;
}

const QuickStockCard = React.memo(function QuickStockCard({
  item,
  categoryName,
  isEmerald,
  onToggleStock,
}: QuickStockCardProps) {
  return (
    <div
      className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 transition-all ${
        item.isAvailable
          ? isEmerald ? 'bg-[#0A261F] border-[#184439]' : 'bg-[#122420] border-[#224038]'
          : 'bg-rose-950/20 border-rose-500/30'
      }`}
    >
      <div className="min-w-0 text-right flex-1">
        <h4 className="text-xs sm:text-sm font-bold text-white break-words leading-snug">
          {item.titleFa}
        </h4>
        <span className="text-[10.5px] text-[#8EA39C] break-words block mt-0.5">
          {categoryName} · {formatPrice(item.price)} ت
        </span>
      </div>

      <button
        onClick={() => onToggleStock(item)}
        className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all active:scale-90 cursor-pointer ${
          item.isAvailable
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
            : 'bg-rose-600 hover:bg-rose-500 text-white'
        }`}
      >
        {item.isAvailable ? 'موجود است' : 'اتمام موجودی'}
      </button>
    </div>
  );
});

interface ItemCatalogRowProps {
  item: MenuItem;
  categoryName?: string;
  onToggleStock: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}

const ItemCatalogRow = React.memo(function ItemCatalogRow({
  item,
  categoryName,
  onToggleStock,
  onEdit,
  onDelete,
}: ItemCatalogRowProps) {
  return (
    <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 transition-colors">
      {/* Right: Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.titleFa}
            loading="lazy"
            decoding="async"
            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <Coffee className="w-5 h-5 text-[#8EA39C]" />
          </div>
        )}

        <div className="min-w-0 text-right flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-white break-words leading-snug">
              {item.titleFa}
            </span>
            {!item.isAvailable && (
              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-rose-600 text-white shrink-0">
                ناموجود
              </span>
            )}
          </div>
          <p className="text-[10.5px] text-[#8EA39C] break-words mt-0.5">
            {item.titleEn} · {categoryName}
          </p>
        </div>
      </div>

      {/* Left: Actions & Price */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
        <span className="text-xs font-black text-[#DFBA87] tabular-nums">
          {formatPrice(item.price)} تومان
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleStock(item)}
            className={`p-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              item.isAvailable
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
            }`}
            title={item.isAvailable ? 'کلیک جهت ناموجود کردن' : 'کلیک جهت موجود کردن'}
          >
            {item.isAvailable ? 'موجود' : 'ناموجود'}
          </button>

          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#CAD6D2] border border-white/10 cursor-pointer"
            title="ویرایش کامل مشخصات"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(item)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400 border border-white/10 cursor-pointer"
            title="حذف آیتم"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

export function DedicatedAdminDashboard({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  items,
  categories,
  cafeInfo,
  onSaveItem,
  onDeleteItem,
  onSaveCategory,
  onDeleteCategory,
  onSaveCafeInfo,
  onResetToDefaults,
  onImportData,
  onBackToMenu,
  initialSection = 'overview',
  initialEditingItem = null,
}: DedicatedAdminDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const isEmerald = theme === 'new-emerald';

  // Navigation section
  const [activeSection, setActiveSection] = useState<AdminDashboardSection>(initialSection);

  // Success Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // PIN Login state
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Item Form / Editing state
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(initialEditingItem);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageInputMethod, setImageInputMethod] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Category Form state
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null);

  // Cafe Info Form state
  const [infoForm, setInfoForm] = useState<CafeInfo>(cafeInfo);
  const [prevCafeInfo, setPrevCafeInfo] = useState<CafeInfo>(cafeInfo);

  if (cafeInfo !== prevCafeInfo) {
    setPrevCafeInfo(cafeInfo);
    setInfoForm(cafeInfo);
  }

  // Search & Filter in Items List
  const [itemSearch, setItemSearch] = useState('');
  const deferredSearch = useDeferredValue(itemSearch);
  const [itemCategoryFilter, setItemCategoryFilter] = useState('all');
  const [itemStockFilter, setItemStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [visibleItemsCount, setVisibleItemsCount] = useState(15);

  // Filters for Quick Stock and Quick Prices
  const [stockCategoryFilter, setStockCategoryFilter] = useState('all');
  const [priceCategoryFilter, setPriceCategoryFilter] = useState('all');

  // Fast Category Map for O(1) lookups
  const categoryMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.nameFa]));
  }, [categories]);

  // Keypad PIN entry with instant validation
  const handleKeypadPress = useCallback((digit: string) => {
    setPinInput((prev) => {
      if (prev.length < 4) {
        const next = prev + digit;
        setLoginError('');
        if (next.length === 4) {
          const success = onLogin(next);
          if (success) {
            setLoginError('');
            return '';
          } else {
            setLoginError('رمز عبور نادرست است (پیش‌فرض: 1234)');
            return next;
          }
        }
        return next;
      }
      return prev;
    });
  }, [onLogin]);

  // Physical keyboard support for PIN entry
  useEffect(() => {
    if (isAdminLoggedIn) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        setPinInput((prev) => prev.slice(0, -1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminLoggedIn, handleKeypadPress]);

  // KPIs
  const totalItems = items.length;
  const inStockCount = useMemo(() => items.filter((i) => i.isAvailable).length, [items]);
  const outOfStockCount = totalItems - inStockCount;
  const totalCategories = categories.length;

  // Filtered items with deferred search for 60fps responsive input
  const filteredItems = useMemo(() => {
    const q = deferredSearch.toLowerCase().trim();
    return items.filter((item) => {
      if (itemCategoryFilter !== 'all' && item.categoryId !== itemCategoryFilter) return false;
      if (itemStockFilter === 'inStock' && !item.isAvailable) return false;
      if (itemStockFilter === 'outOfStock' && item.isAvailable) return false;
      if (q) {
        const matchTitleFa = item.titleFa.toLowerCase().includes(q);
        const matchTitleEn = item.titleEn?.toLowerCase().includes(q);
        if (!matchTitleFa && !matchTitleEn) return false;
      }
      return true;
    });
  }, [items, itemCategoryFilter, itemStockFilter, deferredSearch]);

  // Filtered items for quick stock
  const filteredStockItems = useMemo(() => {
    if (stockCategoryFilter === 'all') return items;
    if (stockCategoryFilter === 'outOfStock') return items.filter((i) => !i.isAvailable);
    return items.filter((i) => i.categoryId === stockCategoryFilter);
  }, [items, stockCategoryFilter]);

  // Filtered items for quick prices
  const filteredPriceItems = useMemo(() => {
    if (priceCategoryFilter === 'all') return items;
    return items.filter((i) => i.categoryId === priceCategoryFilter);
  }, [items, priceCategoryFilter]);

  // Start new item
  const handleStartNewItem = () => {
    setEditingItem({
      id: 'item-' + Date.now(),
      titleFa: '',
      titleEn: '',
      categoryId: categories[0]?.id || 'espresso',
      price: 85000,
      description: '',
      ingredients: [],
      tags: ['ویژه دال'],
      isAvailable: true,
      temperature: 'hot',
      prepTime: '۴ دقیقه',
      aromaNotes: [],
      imageUrl: '',
    });
    setImageInputMethod('upload');
    setActiveSection('items');
  };

  // Image Upload handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const dataUrl = await optimizeImageFile(file);
      setEditingItem(prev => prev ? ({ ...prev, imageUrl: dataUrl }) : null);
    } catch (err) {
      console.error('Image upload failed', err);
      alert('خطا در پردازش تصویر');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Save Item
  const handleSaveItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.titleFa?.trim() || !editingItem?.price) {
      alert('لطفاً نام محصول و قیمت را وارد فرمایید.');
      return;
    }

    onSaveItem({
      ...editingItem,
      titleFa: editingItem.titleFa.trim(),
      titleEn: editingItem.titleEn?.trim() || '',
      categoryId: editingItem.categoryId || categories[0]?.id || 'espresso',
      price: Number(editingItem.price) || 0,
      description: editingItem.description?.trim() || '',
      tags: editingItem.tags || [],
      isAvailable: editingItem.isAvailable !== false,
      temperature: editingItem.temperature || 'hot',
      prepTime: editingItem.prepTime || '',
      aromaNotes: editingItem.aromaNotes || [],
      imageUrl: editingItem.imageUrl || '',
      flavorProfile: isFlavorProfileCategory(editingItem.categoryId || categories[0]?.id || 'espresso')
        ? editingItem.flavorProfile
        : undefined,
      pairingItemId: editingItem.pairingItemId || undefined,
      pairingNote: editingItem.pairingNote?.trim() || undefined,
    } as MenuItem);

    setEditingItem(null);
    showToast('آیتم با موفقیت ذخیره شد.');
  };

  // Toggle item availability
  const handleToggleStock = useCallback((item: MenuItem) => {
    onSaveItem({
      ...item,
      isAvailable: !item.isAvailable,
    });
    showToast(`وضعیت «${item.titleFa}» به ${!item.isAvailable ? 'موجود' : 'ناموجود'} تغییر یافت.`);
  }, [onSaveItem]);

  // Quick Price update
  const handleUpdateItemPrice = useCallback((item: MenuItem, newPrice: number) => {
    if (newPrice > 0) {
      onSaveItem({
        ...item,
        price: newPrice,
      });
      showToast(`قیمت «${item.titleFa}» ذخیره شد.`);
    }
  }, [onSaveItem]);

  const handleEditItemClick = useCallback((item: MenuItem) => {
    setEditingItem(item);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, []);

  const handleDeleteItemClick = useCallback((item: MenuItem) => {
    if (window.confirm(`آیا از حذف آیتم «${item.titleFa}» اطمینان دارید؟`)) {
      onDeleteItem(item.id);
      showToast('آیتم حذف شد.');
    }
  }, [onDeleteItem]);

  // Save Category
  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.nameFa?.trim()) {
      alert('لطفاً نام دسته‌بندی را وارد کنید');
      return;
    }

    const catId = editingCategory.id || 'cat-' + Date.now();
    const isNew = !categories.some(c => c.id === catId);

    onSaveCategory({
      id: catId,
      nameFa: editingCategory.nameFa.trim(),
      nameEn: editingCategory.nameEn?.trim() || editingCategory.nameFa.trim(),
      iconName: editingCategory.iconName || 'Coffee',
      order: editingCategory.order || (isNew ? categories.length + 1 : 1),
      description: editingCategory.description?.trim() || '',
    });

    setEditingCategory(null);
    showToast('دسته‌بندی با موفقیت ذخیره شد.');
  };

  // Delete Category
  const handleDeleteCategoryClick = (cat: Category) => {
    const itemsInCat = items.filter(i => i.categoryId === cat.id);
    if (itemsInCat.length > 0) {
      setCategoryDeleteError(`این دسته‌بندی دارای ${itemsInCat.length} آیتم است. ابتدا باید آیتم‌ها را منتقل یا حذف کنید.`);
      return;
    }
    if (window.confirm(`آیا از حذف دسته‌بندی «${cat.nameFa}» اطمینان دارید؟`)) {
      onDeleteCategory(cat.id);
      showToast('دسته‌بندی حذف شد.');
    }
  };

  // Save Cafe Info
  const handleSaveCafeInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCafeInfo(infoForm);
    showToast('اطلاعات و تنظیمات کافه با موفقیت ذخیره شد.');
  };

  // Export JSON
  const handleExportData = () => {
    const backupData = {
      items,
      categories,
      cafeInfo,
      exportedAt: new Date().toISOString(),
      version: '6.0',
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dal-cafe-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('فایل پشتیبان دانلود شد.');
  };

  // Import JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.items && parsed.categories) {
          onImportData({
            items: parsed.items,
            categories: parsed.categories,
            cafeInfo: parsed.cafeInfo || cafeInfo,
          });
          showToast('اطلاعات پشتیبان با موفقیت بازیابی شد.');
        } else {
          alert('فرمت فایل پشتیبان نامعتبر است.');
        }
      } catch (err) {
        alert('خطا در خواندن فایل');
      }
    };
    reader.readAsText(file);
  };

  // -------------------------------------------------------------
  // If NOT Logged In: Full Screen Sleek Passcode Entry
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors select-none ${
        isEmerald ? 'bg-[#051A15] text-[#F6F4EE]' : 'bg-[#071513] text-[#F0EDE5]'
      }`}>
        <div className={`w-full max-w-sm rounded-3xl p-6 sm:p-8 border shadow-2xl text-center ${
          isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
        }`}>
          {/* Brand Monogram */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-black/40 border border-white/10 p-1.5 flex items-center justify-center">
            <DalLogo size="md" circular={true} showText={false} themeVariant={theme} className="w-full h-full" />
          </div>

          <h1 className="text-xl font-black text-white mb-1">
            ورود به داشبورد مدیریت دال
          </h1>
          <p className="text-xs text-[#8EA39C] mb-6">
            رمز عبور ۴ رقمی مدیر یا باریستا را وارد فرمایید
          </p>

          {/* PIN Indicators */}
          <div className="flex items-center justify-center gap-3.5 mb-6" dir="ltr">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  pinInput.length > idx
                    ? isEmerald ? 'bg-[#DFBA87] scale-125 shadow-md shadow-[#DFBA87]/50' : 'bg-[#C48B4C] scale-125 shadow-md shadow-[#C48B4C]/50'
                    : 'bg-white/10 border border-white/20'
                }`}
              />
            ))}
          </div>

          {loginError && (
            <div className="mb-5 text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-6" dir="ltr">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(digit)}
                className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 text-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPinInput('')}
              className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-xs text-[#8EA39C] active:scale-95 flex items-center justify-center font-bold"
            >
              پاک کردن
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="h-14 rounded-2xl bg-white/5 hover:bg-white/15 active:bg-white/25 border border-white/10 text-xl font-bold text-white transition-all active:scale-95 flex items-center justify-center"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setPinInput((prev) => prev.slice(0, -1))}
              className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-xs text-[#8EA39C] active:scale-95 flex items-center justify-center font-bold"
            >
              ⌫
            </button>
          </div>

          {/* Quick test shortcut */}
          <button
            type="button"
            onClick={() => onLogin('1234')}
            className="text-[11.5px] text-[#A89381] hover:text-[#DFBA87] transition-colors mb-4 block mx-auto"
          >
            رمز پیش‌فرض کافه: <strong className="font-mono text-white underline">1234</strong>
          </button>

          {/* Back to Customer Menu */}
          <button
            onClick={onBackToMenu}
            className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-[#CAD6D2] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            <span>بازگشت به منوی مشتری کافه</span>
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOGGED IN: Professional, Standalone, Lightweight Dashboard
  // -------------------------------------------------------------
  const navItems = [
    {
      id: 'overview' as const,
      title: 'نمای کلی و آمار',
      subtitle: 'شاخص‌ها و دیده‌بان کافه',
      icon: LayoutDashboard,
    },
    {
      id: 'items' as const,
      title: 'مدیریت آیتم‌های منو',
      subtitle: 'افزودن و ویرایش محصولات',
      icon: Coffee,
      badge: totalItems,
      badgeColor: 'bg-white/10 text-white',
    },
    {
      id: 'quick-stock' as const,
      title: 'کنترل سریع موجودی بار',
      subtitle: 'سوئیچ سریع موجود / ناموجود',
      icon: Check,
      badge: outOfStockCount > 0 ? `${outOfStockCount} ناموجود` : undefined,
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'quick-prices' as const,
      title: 'ویرایش سریع قیمت‌ها',
      subtitle: 'تغییر قیمت سریع و درون‌خطی',
      icon: DollarSign,
    },
    {
      id: 'categories' as const,
      title: 'دسته‌بندی‌های منو',
      subtitle: 'سازماندهی و چینش دسته‌ها',
      icon: Layers,
      badge: totalCategories,
      badgeColor: 'bg-white/10 text-white',
    },
    {
      id: 'cafe-info' as const,
      title: 'اطلاعات و تنظیمات کافه',
      subtitle: 'ساعت کاری، تلفن، آدرس و متن‌ها',
      icon: Settings,
    },
    {
      id: 'backup' as const,
      title: 'پشتیبان‌گیری و داده‌ها',
      subtitle: 'خروجی، بازنشانی و فایل JSON',
      icon: Download,
    },
  ];

  const currentNav = navItems.find((n) => n.id === activeSection);

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      isEmerald ? 'bg-[#051A15] text-[#F6F4EE]' : 'bg-[#071513] text-[#F0EDE5]'
    }`}>
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Standalone Dashboard Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl shadow-md ${
        isEmerald ? 'bg-[#08221D]/98 border-[#1A443A]' : 'bg-[#10221E]/98 border-[#224038]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Right: Brand Monogram + Section Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl p-1 bg-black/40 border border-white/10 shrink-0 flex items-center justify-center">
              <DalLogo size="sm" circular={true} showText={false} themeVariant={theme} className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white leading-tight">
                  پنل مدیریت کافه دال
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  آنلاین
                </span>
              </div>
              <p className="text-[10px] text-[#8EA39C] mt-0.5 hidden xs:block">
                میز کار باریستا و سرپرست سالن
              </p>
            </div>
          </div>

          {/* Quick Add Button (Desktop) */}
          <div className="hidden sm:flex items-center">
            <button
              onClick={handleStartNewItem}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isEmerald 
                  ? 'bg-[#DFBA87] text-[#1E170F] hover:bg-[#EED0A6]' 
                  : 'bg-[#C48B4C] text-[#1B1107] hover:bg-[#DBA366]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>+ افزودن آیتم جدید</span>
            </button>
          </div>

          {/* Left: Actions (Theme, Back to Menu, Logout) */}
          <div className="flex items-center gap-2">
            
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-[#CCD7D2] border border-white/10 transition-colors flex items-center gap-1.5"
              title="تغییر پوسته داشبورد"
            >
              <Palette className="w-4 h-4 text-[#DFBA87]" />
              <span className="hidden sm:inline text-[11px]">{isEmerald ? 'پوسته زمردی' : 'پوسته کنیاک'}</span>
            </button>

            {/* Back to Customer Menu Button */}
            <button
              onClick={onBackToMenu}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                isEmerald 
                  ? 'bg-[#DFBA87] text-[#1E170F] hover:bg-[#EED0A6]' 
                  : 'bg-[#C48B4C] text-[#1B1107] hover:bg-[#DBA366]'
              }`}
              title="مشاهده ظاهر کافه برای مشتریان"
            >
              <Eye className="w-4 h-4" />
              <span>مشاهده منوی مشتری</span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-[#8EA39C] border border-white/10 transition-colors flex items-center gap-1.5"
              title="خروج از حساب مدیریت"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs Bar (Horizontal Scrollable Tabs with Clear Categorization) */}
        <div className="border-t border-white/5 bg-black/20 overflow-x-auto scrollbar-none px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 py-2 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setEditingItem(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? isEmerald
                        ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black'
                        : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                      : 'text-[#8EA39C] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono tabular-nums ${
                      item.badgeColor || (isActive ? 'bg-black/20 text-[#1E170F]' : 'bg-black/30')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">

        {/* ------------------------------------------------------------- */}
        {/* SECTION 1: OVERVIEW & LIVE KPIS */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Greeting & Barista Shortcuts */}
            <div className={`p-5 rounded-3xl border ${
              isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#DFBA87]" />
                    <span>خوش آمدید · وضعیت لحظه‌ای کافه دال</span>
                  </h2>
                  <p className="text-xs text-[#8EA39C] mt-1">
                    شما می‌توانید از منوی بالای داشبورد به هر بخش دسترسی داشته باشید.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartNewItem}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-md ${
                      isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ افزودن آیتم جدید</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('quick-stock')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>کنترل موجودی</span>
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Stat Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              
              <div className={`p-4 rounded-2xl border ${
                isEmerald ? 'bg-[#0A261F] border-[#184439]' : 'bg-[#122420] border-[#224038]'
              }`}>
                <div className="flex items-center justify-between text-[#8EA39C] mb-1">
                  <span className="text-xs font-semibold">کل آیتم‌های منو</span>
                  <Coffee className="w-4 h-4 text-[#DFBA87]" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {totalItems}
                </div>
                <span className="text-[11px] text-[#8EA39C]">در {totalCategories} دسته‌بندی مختلف</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isEmerald ? 'bg-[#0A261F] border-[#184439]' : 'bg-[#122420] border-[#224038]'
              }`}>
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs font-semibold">موجود و آماده سرو</span>
                  <Check className="w-4 h-4" />
                </div>
                <div className="text-2xl font-black text-emerald-400 tabular-nums">
                  {inStockCount}
                </div>
                <span className="text-[11px] text-[#8EA39C]">فعال در منوی مشتریان</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                outOfStockCount > 0 
                  ? 'bg-rose-950/20 border-rose-500/30' 
                  : isEmerald ? 'bg-[#0A261F] border-[#184439]' : 'bg-[#122420] border-[#224038]'
              }`}>
                <div className="flex items-center justify-between text-rose-400 mb-1">
                  <span className="text-xs font-semibold">اتمام موجودی</span>
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className={`text-2xl font-black tabular-nums ${outOfStockCount > 0 ? 'text-rose-400' : 'text-white/60'}`}>
                  {outOfStockCount}
                </div>
                <span className="text-[11px] text-[#8EA39C]">نیازمند شارژ انبار</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isEmerald ? 'bg-[#0A261F] border-[#184439]' : 'bg-[#122420] border-[#224038]'
              }`}>
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-xs font-semibold">ساعات کاری کافه</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {cafeInfo.workingHoursWeekday || '۰۸:۳۰ - ۲۳:۳۰'}
                </div>
                <span className="text-[10px] text-[#8EA39C]">
                  {cafeInfo.workingHoursWeekend || 'پنجشنبه و جمعه تا ۲۴:۰۰'}
                </span>
              </div>

            </div>

            {/* Quick Actions Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setActiveSection('quick-stock')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">کنترل موجودی بار</h3>
                    <p className="text-[11px] text-[#8EA39C] mt-0.5">روشن/خاموش کردن آیتم‌های تمام شده</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setActiveSection('quick-prices')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">ویرایش سریع قیمت‌ها</h3>
                    <p className="text-[11px] text-[#8EA39C] mt-0.5">بروزرسانی درجا نرخ‌های منو</p>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setActiveSection('cafe-info')}
                className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">تنظیمات کافه و ساعات کاری</h3>
                    <p className="text-[11px] text-[#8EA39C] mt-0.5">ویرایش ساعات کاری، تلفن و آدرس</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Out of Stock Alert List if any */}
            {outOfStockCount > 0 && (
              <div className="p-4 rounded-3xl bg-rose-950/20 border border-rose-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>آیتم‌های در وضعیت اتمام موجودی ({outOfStockCount} مورد):</span>
                  </div>
                  <button
                    onClick={() => setActiveSection('quick-stock')}
                    className="text-xs text-rose-400 hover:text-white underline"
                  >
                    مدیریت همه
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {items.filter(i => !i.isAvailable).map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-rose-500/20 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-white font-medium break-words leading-tight flex-1">{item.titleFa}</span>
                      <button
                        onClick={() => handleToggleStock(item)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
                      >
                        موجود کردن
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: MENU ITEMS CATALOG & FULL ITEM FORM */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'items' && (
          <div className="space-y-4">
            
            {/* Header of items */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  مدیریت آیتم‌های منو
                </h2>
                <p className="text-xs text-[#8EA39C] mt-0.5">
                  افزودن، ویرایش توضیحات، تصاویر، شاخص‌های طعمی و قیمت اقلام
                </p>
              </div>

              <button
                onClick={handleStartNewItem}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>+ افزودن آیتم جدید</span>
              </button>
            </div>

            {/* If currently editing an item, show Dedicated Form */}
            {editingItem ? (
              <div className={`p-5 rounded-3xl border ${
                isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
              }`}>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Edit className="w-4 h-4 text-[#DFBA87]" />
                    <span>
                      {items.some(i => i.id === editingItem.id) ? `ویرایش آیتم: ${editingItem.titleFa}` : 'افزودن آیتم جدید به منو'}
                    </span>
                  </h3>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8EA39C] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveItemSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Title FA */}
                    <div>
                      <label className="block text-xs font-semibold text-[#CAD6D2] mb-1.5">
                        نام فارسی محصول *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingItem.titleFa || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleFa: e.target.value })}
                        placeholder="مثال: لته کارامل"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-[#DFBA87]"
                      />
                    </div>

                    {/* Title EN */}
                    <div>
                      <label className="block text-xs font-semibold text-[#CAD6D2] mb-1.5">
                        نام انگلیسی (Subtitle)
                      </label>
                      <input
                        type="text"
                        value={editingItem.titleEn || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                        placeholder="Caramel Latte"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-[#DFBA87]"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-[#CAD6D2] mb-1.5">
                        دسته‌بندی محصول *
                      </label>
                      <select
                        value={editingItem.categoryId || categories[0]?.id}
                        onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-[#DFBA87]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameFa}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price in Tomans */}
                    <div>
                      <label className="block text-xs font-semibold text-[#CAD6D2] mb-1.5">
                        قیمت به تومان *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1000"
                        value={editingItem.price || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                        placeholder="مثال: 95000"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-[#DFBA87] tabular-nums"
                      />
                    </div>

                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-[#CAD6D2] mb-1.5">
                      توضیحات و رسپی کوتاه
                    </label>
                    <textarea
                      rows={2}
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      placeholder="توضیح کوتاه درباره طعم، نحوه تهیه یا سرو..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none focus:border-[#DFBA87]"
                    />
                  </div>

                  {/* Image input method */}
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#DFBA87]" />
                        <span>عکس محصول:</span>
                      </span>
                      <div className="flex items-center gap-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setImageInputMethod('upload')}
                          className={`px-2 py-0.5 rounded-lg ${imageInputMethod === 'upload' ? 'bg-[#DFBA87] text-[#1E170F] font-bold' : 'text-[#8EA39C]'}`}
                        >
                          آپلود فایل
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageInputMethod('url')}
                          className={`px-2 py-0.5 rounded-lg ${imageInputMethod === 'url' ? 'bg-[#DFBA87] text-[#1E170F] font-bold' : 'text-[#8EA39C]'}`}
                        >
                          لینک تصویر
                        </button>
                      </div>
                    </div>

                    {imageInputMethod === 'upload' ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          className="text-xs text-[#8EA39C]"
                        />
                        {isUploadingImage && <span className="text-xs text-amber-400">در حال پردازش عکس...</span>}
                      </div>
                    ) : (
                      <input
                        type="url"
                        value={editingItem.imageUrl || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-black/30 border border-white/10 text-white focus:outline-none"
                      />
                    )}

                    {editingItem.imageUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={editingItem.imageUrl}
                          alt="پیش‌نمایش"
                          className="w-12 h-12 rounded-xl object-cover border border-white/15"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, imageUrl: '' })}
                          className="text-[11px] text-rose-400 hover:underline"
                        >
                          حذف عکس
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stock Availability Toggle */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/20 border border-white/10">
                    <label className="text-xs font-bold text-white flex-1">
                      وضعیت موجودی در کافه:
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, isAvailable: !editingItem.isAvailable })}
                      className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                        editingItem.isAvailable !== false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {editingItem.isAvailable !== false ? 'موجود در بار' : 'اتمام موجودی'}
                    </button>
                  </div>

                  {/* Smart Pairing Recommendation (همنشینی هوشمند قهوه و کیک) */}
                  <div className="p-3 rounded-2xl bg-black/20 border border-white/10 space-y-2">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#DFBA87]" />
                      <span>پیشنهاد همنشینی باریستا (Smart Pairing):</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={editingItem.pairingItemId || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, pairingItemId: e.target.value || undefined })}
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                      >
                        <option value="">بدون پیشنهاد همنشینی</option>
                        {items
                          .filter(i => i.id !== editingItem.id)
                          .map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.titleFa} ({categories.find(c => c.id === i.categoryId)?.nameFa})
                            </option>
                          ))}
                      </select>

                      <input
                        type="text"
                        value={editingItem.pairingNote || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, pairingNote: e.target.value })}
                        placeholder="علت پیشنهاد (مثال: تعادل تلخی با شیرینی ملایم چیزکیک)"
                        className="w-full px-3 py-1.5 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {/* Form Action buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      type="submit"
                      className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 ${
                        isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                      }`}
                    >
                      ذخیره آیتم
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Category Quick Chips for Instant Navigation */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => {
                      setItemCategoryFilter('all');
                      setVisibleItemsCount(15);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      itemCategoryFilter === 'all'
                        ? isEmerald ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black' : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                        : 'bg-white/5 text-[#8EA39C] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    همه دسته‌ها ({items.length})
                  </button>
                  {categories.map((c) => {
                    const count = items.filter((i) => i.categoryId === c.id).length;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setItemCategoryFilter(c.id);
                          setVisibleItemsCount(15);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                          itemCategoryFilter === c.id
                            ? isEmerald ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black' : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                            : 'bg-white/5 text-[#8EA39C] hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {c.nameFa} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#8EA39C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={itemSearch}
                      onChange={(e) => {
                        setItemSearch(e.target.value);
                        setVisibleItemsCount(15);
                      }}
                      placeholder="جستجوی سریع عنوان محصول..."
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#DFBA87]"
                    />
                  </div>

                  <select
                    value={itemCategoryFilter}
                    onChange={(e) => {
                      setItemCategoryFilter(e.target.value);
                      setVisibleItemsCount(15);
                    }}
                    className="px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                  >
                    <option value="all">همه دسته‌بندی‌ها</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameFa}
                      </option>
                    ))}
                  </select>

                  <select
                    value={itemStockFilter}
                    onChange={(e) => {
                      setItemStockFilter(e.target.value as any);
                      setVisibleItemsCount(15);
                    }}
                    className="px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                  >
                    <option value="all">همه موجودی‌ها</option>
                    <option value="inStock">فقط موجودها</option>
                    <option value="outOfStock">فقط ناموجودها</option>
                  </select>
                </div>

                {/* Items Table / Cards Grid with High Performance Batching */}
                <div className="divide-y divide-white/5 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
                  {filteredItems.slice(0, visibleItemsCount).map((item) => (
                    <ItemCatalogRow
                      key={item.id}
                      item={item}
                      categoryName={categoryMap.get(item.categoryId)}
                      onToggleStock={handleToggleStock}
                      onEdit={handleEditItemClick}
                      onDelete={handleDeleteItemClick}
                    />
                  ))}
                  {filteredItems.length === 0 && (
                    <div className="p-8 text-center text-xs text-[#8EA39C]">
                      هیچ آیتمی با مشخصات جستجو شده یافت نشد.
                    </div>
                  )}
                </div>

                {/* Load More Button for silky smooth 60fps responsiveness */}
                {filteredItems.length > visibleItemsCount && (
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setVisibleItemsCount((prev) => prev + 15)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer ${
                        isEmerald
                          ? 'bg-[#184539] hover:bg-[#205A4B] text-[#DFBA87] border border-[#2D6F5E]'
                          : 'bg-[#1E3831] hover:bg-[#294B42] text-[#DBA366] border border-[#355B51]'
                      }`}
                    >
                      نمایش ۱۵ مورد بیشتر (نمایش {visibleItemsCount} از {filteredItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibleItemsCount(filteredItems.length)}
                      className="px-3 py-2 rounded-xl text-xs font-medium text-[#8EA39C] hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      نمایش همه ({filteredItems.length})
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: BARISTA QUICK STOCK TOGGLE */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'quick-stock' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>کنترل سریع موجودی باریستا (Quick Stock)</span>
              </h2>
              <p className="text-xs text-[#8EA39C] mt-0.5">
                در لحظه شلوغی کافه، هر آیتمی که تمام شد را با یک ضربه ناموجود یا دوباره موجود کنید.
              </p>
            </div>

            {/* Category Quick Chips for Stock Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setStockCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  stockCategoryFilter === 'all'
                    ? isEmerald ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black' : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                    : 'bg-white/5 text-[#8EA39C] hover:bg-white/10 hover:text-white'
                }`}
              >
                همه ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setStockCategoryFilter('outOfStock')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  stockCategoryFilter === 'outOfStock'
                    ? 'bg-rose-600 text-white shadow-sm font-black'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/50'
                }`}
              >
                فقط ناموجودها ({outOfStockCount})
              </button>
              {categories.map((c) => {
                const count = items.filter((i) => i.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setStockCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      stockCategoryFilter === c.id
                        ? isEmerald ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black' : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                        : 'bg-white/5 text-[#8EA39C] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {c.nameFa} ({count})
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredStockItems.map((item) => (
                <QuickStockCard
                  key={item.id}
                  item={item}
                  categoryName={categoryMap.get(item.categoryId)}
                  isEmerald={isEmerald}
                  onToggleStock={handleToggleStock}
                />
              ))}
              {filteredStockItems.length === 0 && (
                <div className="col-span-full p-8 text-center text-xs text-[#8EA39C]">
                  موردی در این دسته‌بندی یافت نشد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: QUICK BULK PRICE EDITOR */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'quick-prices' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <span>ویرایش سریع و درجا قیمت‌ها</span>
              </h2>
              <p className="text-xs text-[#8EA39C] mt-0.5">
                مستقیماً در کادر مربوطه قیمت جدید را به تومان تایپ کرده و کلید تیک را بزنید تا بدون نیاز به فرم ذخیره شود.
              </p>
            </div>

            {/* Category Quick Chips for Price Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setPriceCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  priceCategoryFilter === 'all'
                    ? isEmerald ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black' : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                    : 'bg-white/5 text-[#8EA39C] hover:bg-white/10 hover:text-white'
                }`}
              >
                همه دسته‌ها ({items.length})
              </button>
              {categories.map((c) => {
                const count = items.filter((i) => i.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setPriceCategoryFilter(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      priceCategoryFilter === c.id
                        ? isEmerald ? 'bg-[#DFBA87] text-[#1E170F] shadow-sm font-black' : 'bg-[#C48B4C] text-[#1B1107] shadow-sm font-black'
                        : 'bg-white/5 text-[#8EA39C] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {c.nameFa} ({count})
                  </button>
                );
              })}
            </div>

            <div className="divide-y divide-white/5 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
              {filteredPriceItems.map((item) => (
                <QuickPriceRow
                  key={item.id}
                  item={item}
                  categoryName={categoryMap.get(item.categoryId)}
                  onSavePrice={handleUpdateItemPrice}
                />
              ))}
              {filteredPriceItems.length === 0 && (
                <div className="p-8 text-center text-xs text-[#8EA39C]">
                  موردی در این دسته‌بندی یافت نشد.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: CATEGORIES MANAGEMENT */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  مدیریت دسته‌بندی‌های کافه
                </h2>
                <p className="text-xs text-[#8EA39C] mt-0.5">
                  تغییر نام فارسی/انگلیسی، آیکون و ترتیب نمایش در منو
                </p>
              </div>

              <button
                onClick={() => setEditingCategory({
                  nameFa: '',
                  nameEn: '',
                  iconName: 'Coffee',
                  order: categories.length + 1,
                  description: '',
                })}
                className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                  isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>+ دسته‌بندی جدید</span>
              </button>
            </div>

            {categoryDeleteError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{categoryDeleteError}</span>
              </div>
            )}

            {/* Category Form */}
            {editingCategory && (
              <form onSubmit={handleSaveCategorySubmit} className={`p-4 rounded-3xl border space-y-3 ${
                isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
              }`}>
                <h3 className="text-sm font-bold text-white mb-2">
                  {editingCategory.id ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#8EA39C] mb-1">نام فارسی دسته *</label>
                    <input
                      type="text"
                      required
                      value={editingCategory.nameFa || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, nameFa: e.target.value })}
                      placeholder="مثال: بار گرم"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#8EA39C] mb-1">نام انگلیسی دسته</label>
                    <input
                      type="text"
                      value={editingCategory.nameEn || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, nameEn: e.target.value })}
                      placeholder="Hot Bar"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#8EA39C] mb-1">آیکون انتخابی</label>
                    <select
                      value={editingCategory.iconName || 'Coffee'}
                      onChange={(e) => setEditingCategory({ ...editingCategory, iconName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                    >
                      {CATEGORY_ICON_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#8EA39C] mb-1">ترتیب نمایش (Order)</label>
                    <input
                      type="number"
                      value={editingCategory.order || 1}
                      onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white tabular-nums"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className={`flex-1 py-2 rounded-xl text-xs font-black ${
                      isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                    }`}
                  >
                    ذخیره دسته‌بندی
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryDeleteError(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 text-xs text-white"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            )}

            {/* Categories List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const count = items.filter(i => i.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="p-3.5 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#DFBA87]">
                        {renderCatIcon(cat.iconName, 'w-5 h-5')}
                      </div>
                      <div className="min-w-0 text-right">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {cat.nameFa}
                        </h4>
                        <p className="text-[10px] text-[#8EA39C] truncate">
                          {cat.nameEn} · {count} آیتم
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white"
                        title="ویرایش دسته"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategoryClick(cat)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-rose-400"
                        title="حذف دسته"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 6: CAFE SETTINGS & INFO */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'cafe-info' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <span>اطلاعات کافه و ساعات کاری</span>
              </h2>
              <p className="text-xs text-[#8EA39C] mt-0.5">
                تغییر ساعات کاری، شماره تماس، اینستاگرام و آدرس کافه
              </p>
            </div>

            <form onSubmit={handleSaveCafeInfoSubmit} className={`p-5 rounded-3xl border space-y-4 ${
              isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
            }`}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">نام کافه</label>
                  <input
                    type="text"
                    value={infoForm.name}
                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">شعار برند</label>
                  <input
                    type="text"
                    value={infoForm.slogan}
                    onChange={(e) => setInfoForm({ ...infoForm, slogan: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">ساعت کاری روزهای هفته</label>
                  <input
                    type="text"
                    value={infoForm.workingHoursWeekday}
                    onChange={(e) => setInfoForm({ ...infoForm, workingHoursWeekday: e.target.value })}
                    placeholder="شنبه تا چهارشنبه: ۰۸:۳۰ الی ۲۳:۳۰"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">ساعت کاری آخر هفته</label>
                  <input
                    type="text"
                    value={infoForm.workingHoursWeekend}
                    onChange={(e) => setInfoForm({ ...infoForm, workingHoursWeekend: e.target.value })}
                    placeholder="پنجشنبه و جمعه: ۰۸:۳۰ الی ۲۴:۰۰"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">شماره تماس ثابت/همراه</label>
                  <input
                    type="text"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">شناسه اینستاگرام (بدون @)</label>
                  <input
                    type="text"
                    value={infoForm.instagram}
                    onChange={(e) => setInfoForm({ ...infoForm, instagram: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#CAD6D2] mb-1">آدرس پستی کافه</label>
                <textarea
                  rows={2}
                  value={infoForm.address}
                  onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-black/30 border border-white/10 text-white"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 ${
                  isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                }`}
              >
                ذخیره اطلاعات و تنظیمات کافه
              </button>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* SECTION 7: BACKUP & DATA RESTORE */}
        {/* ------------------------------------------------------------- */}
        {activeSection === 'backup' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-white/10">
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" />
                <span>پشتیبان‌گیری، خروجی و بازنشانی داده‌ها</span>
              </h2>
              <p className="text-xs text-[#8EA39C] mt-0.5">
                یک فایل پشتیبان کامل از تمامی آیتم‌ها، دسته‌ها و قیمت‌ها دانلود یا وارد کنید.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Export Card */}
              <div className={`p-5 rounded-3xl border ${
                isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
              }`}>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>دانلود فایل خروجی (Export)</span>
                </h3>
                <p className="text-xs text-[#8EA39C] mb-4 leading-relaxed">
                  تمامی آیتم‌های منو، قیمت‌ها و دسته‌بندی‌ها به صورت فایل استاندارد JSON ذخیره می‌شوند.
                </p>
                <button
                  onClick={handleExportData}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                    isEmerald ? 'bg-[#DFBA87] text-[#1E170F]' : 'bg-[#C48B4C] text-[#1B1107]'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل پشتیبان JSON</span>
                </button>
              </div>

              {/* Import Card */}
              <div className={`p-5 rounded-3xl border ${
                isEmerald ? 'bg-[#08221D] border-[#184439]' : 'bg-[#10221E] border-[#224038]'
              }`}>
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>وارد کردن فایل پشتیبان (Import)</span>
                </h3>
                <p className="text-xs text-[#8EA39C] mb-4 leading-relaxed">
                  فایل پشتیبان را انتخاب کنید تا منو به حالت قبل بازگردد.
                </p>
                <label className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-2 cursor-pointer transition-colors border border-white/10">
                  <Upload className="w-4 h-4" />
                  <span>انتخاب فایل پشتیبان JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

            </div>

            {/* Factory Reset Card */}
            <div className="p-4 rounded-3xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-rose-300">
                  بازنشانی به منوی اولیه کارخانه
                </h4>
                <p className="text-[11px] text-[#8EA39C]">
                  بازگرداندن تمام آیتم‌ها و دسته‌ها به مقادیر اصلی پیش‌فرض دال
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('آیا مطمئن هستید؟ تمام تغییرات اعمال شده پاک شده و به منوی پیش‌فرض برمی‌گردد.')) {
                    onResetToDefaults();
                    showToast('داده‌ها به حالت اولیه بازنشانی شدند.');
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all active:scale-95 shrink-0"
              >
                بازنشانی منو
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
