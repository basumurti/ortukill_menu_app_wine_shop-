export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'ANGGUR' | 'BIR & VODKA MIX' | 'SOJU' | 'WHISKY' | 'RUM' | 'VODKA' | 'JAMU' | 'PROMO' | string;
  abv?: string; // Alcohol By Volume e.g. "19.7%"
  volume?: string; // Volume e.g. "620ML", "330ML", "500ML"
  regularPrice: number; // Regular price
  redPrice: number; // Harga Jual Merah (Reseller/Promo/Special list as specified in Google Sheets)
  stock: number;
  image?: string;
  isPromo?: boolean;
  description?: string;
  rowNumber?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LocationData {
  lat: number | null;
  lng: number | null;
  address: string;
  googleMapsUrl: string;
  distanceKm?: number;
  durationMinutes?: number;
  isFreeShipping?: boolean;
  notes?: string;
}

export interface OrderDetails {
  id: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'CASH' | 'TRANSFER' | 'QRIS' | 'GOPAY' | 'JAGO' | string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  location: LocationData;
  durationMinutes?: number;
  distanceKm?: number;
  notes: string;
  createdAt: string;
}

export interface SheetsConfig {
  webAppUrl: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  useRedPrice: boolean; // Flag to enable/disable Harga Merah as primary display price
  autoSaveToSheets: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  products?: Product[];
  count?: number;
  data?: T;
  transactionId?: string;
}
