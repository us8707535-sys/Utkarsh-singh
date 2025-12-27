
export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'standard' | 'large' | 'extra-large';
  reducedMotion: boolean;
  dyslexicFont: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  expiryDate: string;
  mrp: number; // Maximum Retail Price
  price: number; // Selling Price
  stock: number;
  imageUrl: string;
  requiresPrescription: boolean;
  sellerId: string;
  rating: number;
  reviewsCount: number;
  apiSource?: 'jan_aushadhi' | 'tatamg' | 'local' | 'west_pharma';
  isGeneric?: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  licenseNo: string;
  isGovtApproved: boolean;
  apiProvided: string[]; // List of APIs (Pre-medicines) provided
  rating: number;
}

export interface SourcingStats {
  totalMonthlyTurnover: number;
  requiredSourcingMin: number; // 5%
  requiredSourcingMax: number; // 10%
  currentSourcingValue: number;
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  isLocal?: boolean;
  estimatedArrival?: string;
  deliveryCoords?: [number, number]; // [lat, lng]
}

export interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
