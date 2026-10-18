export interface FlavorProfile {
  caffeine?: number;   // 0 to 5
  body?: number;       // 0 to 5 (بافت و غلظت)
  acidity?: number;    // 0 to 5 (اسیدیته / طعم‌یاد مرکباتی-میوه‌ای)
  bitterness?: number; // 0 to 5 (تلخی)
  sweetness?: number;  // 0 to 5 (شیرینی ذاتی)
}

export interface MenuItem {
  id: string;
  titleFa: string;
  titleEn: string;
  categoryId: string;
  price: number; // in Tomans
  description: string;
  ingredients?: string[];
  tags: string[]; // e.g., 'ویژه دال', 'کم‌کافئین', 'سرد', 'بدون قند', 'وگان'
  isAvailable: boolean;
  temperature?: 'hot' | 'cold' | 'both';
  prepTime?: string;
  aromaNotes?: string[];
  image?: string;
  imageUrl?: string;
  featured?: boolean;
  flavorProfile?: FlavorProfile;
  pairingItemId?: string; // ID of recommended pairing item
  pairingNote?: string;   // Short pairing rationale (e.g., 'تعادل بی‌نظیر با اسیدیته میوه‌ای')
}

export interface Category {
  id: string;
  nameFa: string;
  nameEn: string;
  iconName: string;
  order: number;
  description?: string;
}

export interface CafeInfo {
  name: string;
  nameEn: string;
  slogan: string;
  sloganEn: string;
  aboutText: string;
  address: string;
  phone: string;
  instagram: string;
  whatsapp?: string;
  telegram?: string;
  workingHoursWeekday: string;
  workingHoursWeekend: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  navigationLinks: {
    neshan: string;
    balad: string;
    googleMaps: string;
  };
}

export interface TrayItem {
  item: MenuItem;
  quantity: number;
}
