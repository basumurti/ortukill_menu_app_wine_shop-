import { Product, SheetsConfig, ApiResponse, OrderDetails } from '../types/menu';
import { INITIAL_PRODUCTS } from '../data/initialMenu';

const CONFIG_KEY = 'ortukill_sheets_config_v1';
const LOCAL_PRODUCTS_KEY = 'ortukill_products_cache_v1';

export const DEFAULT_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz3ETMp4XjXq7Qi2zdGuMNr9EVjZGrU5UTuT6g93nXNH3SyZSmIa6sys4Jrd8nNAJFiAA/exec';

export const getSheetsConfig = (): SheetsConfig => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        webAppUrl: DEFAULT_SHEETS_URL,
        isConnected: true
      };
    } catch (e) {
      console.error('Failed to parse sheets config', e);
    }
  }
  return {
    webAppUrl: DEFAULT_SHEETS_URL,
    isConnected: true,
    useRedPrice: true, // Default to "Harga Merah" list as requested
    autoSaveToSheets: true
  };
};

export const saveSheetsConfig = (config: SheetsConfig): void => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const fetchProductsFromSheets = async (webAppUrl?: string): Promise<{ products: Product[]; isLive: boolean; error?: string }> => {
  const config = getSheetsConfig();
  const url = webAppUrl || config.webAppUrl || DEFAULT_SHEETS_URL;

  if (!url || !url.startsWith('http')) {
    return {
      products: getCachedOrInitialProducts(),
      isLive: false,
      error: 'URL Google Sheets Apps Script belum dikonfigurasi.'
    };
  }

  try {
    const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}action=getProducts&t=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
      // Map sheets row data to our frontend Product model
      const mappedProducts: Product[] = data.products
        .map((p: any) => {
          const rawStock = p.stock !== undefined ? p.stock : (p.stok !== undefined ? p.stok : (p.qty !== undefined ? p.qty : 50));
          const stockNum = typeof rawStock === 'string' ? parseFloat(rawStock.replace(/[^0-9.-]/g, '')) || 0 : Number(rawStock);

          const cleanName = (p.name || '').trim();
          const cleanSku = (p.sku || '').trim();
          const cleanId = (p.id || '').trim();
          const stableId = cleanId || cleanSku || (cleanName ? `PROD-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : `PROD-ROW-${p.rowNumber || 'N'}`);

          return {
            id: stableId,
            sku: cleanSku || cleanId || stableId,
            name: cleanName || 'Produk Tanpa Nama',
            category: p.category || 'ANGGUR',
            abv: p.abv || (p.name?.includes('19.7') ? '19.7%' : p.name?.includes('4.8') ? '4.8%' : undefined),
            volume: p.volume || (p.name?.includes('620ML') ? '620ML' : p.name?.includes('330ML') ? '330ML' : '620ML'),
            regularPrice: Number(p.price || p.regularPrice || 85000),
            redPrice: Number(p.redPrice || p.price || 80000),
            stock: isNaN(stockNum) ? 0 : stockNum,
            description: p.description || `${p.name} - Kualitas terjamin ORTUKILL KEDIRI`,
            rowNumber: p.rowNumber
          };
        })
        .filter((p: Product) => p.stock > 0); // Hide out of stock items automatically

      // Cache locally
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(mappedProducts));
      saveSheetsConfig({
        ...config,
        webAppUrl: url,
        isConnected: true,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      });

      return { products: mappedProducts, isLive: true };
    } else {
      return {
        products: getCachedOrInitialProducts().filter(p => p.stock > 0),
        isLive: false,
        error: data.message || 'Gagal memuat data dari Google Sheets.'
      };
    }
  } catch (err: any) {
    console.warn('Sheets fetch error, falling back to local dataset:', err);
    return {
      products: getCachedOrInitialProducts().filter(p => p.stock > 0),
      isLive: false,
      error: `Koneksi gagal (${err.message || 'CORS / Server'}). Menggunakan data lokal.`
    };
  }
};

export const saveTransactionToSheets = async (_order: OrderDetails): Promise<ApiResponse> => {
  // STRICT READ-ONLY MODE: No POST requests or logging to log_penjualan in Google Sheets
  return {
    success: true,
    message: 'Read-only mode: Pesanan langsung diteruskan ke WhatsApp tanpa mengubah database.'
  };
};

export const pingSheets = async (webAppUrl: string): Promise<{ success: boolean; message: string; rawData?: any }> => {
  try {
    const testUrl = `${webAppUrl}${webAppUrl.includes('?') ? '&' : '?'}action=diagnose&t=${Date.now()}`;
    const response = await fetch(testUrl);
    const data = await response.json();
    if (data && data.success) {
      return {
        success: true,
        message: `Terhubung ke: ${data.spreadsheetName || 'Spreadsheet Ortukill'}`,
        rawData: data
      };
    } else {
      return {
        success: false,
        message: data.message || 'Respon Google Sheets tidak valid.'
      };
    }
  } catch (e: any) {
    return {
      success: false,
      message: `Gagal terhubung (${e.message || 'CORS / Blocked'}). Pastikan Web App diset "Anyone" (Siapa Saja).`
    };
  }
};

export const triggerFillCategoriesInSheets = async (webAppUrl: string): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `${webAppUrl}${webAppUrl.includes('?') ? '&' : '?'}action=fillCategories&t=${Date.now()}`;
    const response = await fetch(url);
    const data = await response.json();
    return {
      success: data.success || false,
      message: data.message || 'Proses pengisian kategori selesai.'
    };
  } catch (e: any) {
    return {
      success: false,
      message: `Gagal eksekusi: ${e.message}`
    };
  }
};

export const getCachedOrInitialProducts = (): Product[] => {
  const cached = localStorage.getItem(LOCAL_PRODUCTS_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cached products', e);
    }
  }
  return INITIAL_PRODUCTS;
};
