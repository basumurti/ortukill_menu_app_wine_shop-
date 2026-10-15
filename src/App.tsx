import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, SheetsConfig, OrderDetails } from './types/menu';
import { INITIAL_PRODUCTS, STORE_INFO } from './data/initialMenu';
import { fetchProductsFromSheets, getSheetsConfig, saveSheetsConfig, getCachedOrInitialProducts } from './services/sheetsService';

import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { SearchBar } from './components/SearchBar';
import { MenuItemCard } from './components/MenuItemCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { VerticalMenuView } from './components/VerticalMenuView';

import { ShoppingBag, Truck, MessageCircle, MapPin, Sparkles, AlertCircle, Camera } from 'lucide-react';
import bgWebImage from './assets/images/ORTUKILL bg web.jpg';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    return getCachedOrInitialProducts().filter((p) => p.stock > 0);
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'name'>('popular');
  
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig>(getSheetsConfig());
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  
  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState<boolean>(false);
  const [isVerticalMenuOpen, setIsVerticalMenuOpen] = useState<boolean>(false);
  const [autoCaptureVertical, setAutoCaptureVertical] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] = useState<OrderDetails | null>(null);

  // Auto load products from Google Sheets and auto-sync every 1 minute (60,000ms)
  useEffect(() => {
    loadProducts();

    const intervalId = setInterval(() => {
      loadProducts();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const loadProducts = async () => {
    setIsLoadingLive(true);
    const { products: fetchedProducts, isLive } = await fetchProductsFromSheets();
    if (fetchedProducts && fetchedProducts.length > 0) {
      setProducts(fetchedProducts);
    }
    setIsLoadingLive(false);
  };

  // Toggle "List Harga Merah"
  const handleToggleRedPrice = () => {
    const updated = { ...sheetsConfig, useRedPrice: !sheetsConfig.useRedPrice };
    setSheetsConfig(updated);
    saveSheetsConfig(updated);
  };

  // Add item to cart
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id || (product.name && item.product.name === product.name)
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1
        };
        return updated;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  // Remove or decrement item from cart
  const handleRemoveFromCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id || (product.name && item.product.name === product.name)
      );
      if (existingIndex >= 0) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty > 1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: currentQty - 1
          };
          return updated;
        } else {
          return prev.filter(
            (item) => !(item.product.id === product.id || (product.name && item.product.name === product.name))
          );
        }
      }
      return prev;
    });
  };

  // Update item quantity directly in cart
  const handleUpdateCartQuantity = (product: Product, delta: number) => {
    if (delta > 0) {
      handleAddToCart(product);
    } else {
      handleRemoveFromCart(product);
    }
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Available in-stock products
  const availableProducts = useMemo(() => {
    return products.filter((p) => p.stock > 0);
  }, [products]);

  // Dynamically extract categories directly from Google Sheets/dashboard data
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>();
    set.add('SEMUA');
    availableProducts.forEach((p) => {
      if (p.category) {
        const cat = p.category.trim().toUpperCase();
        if (cat) set.add(cat);
      }
    });
    return Array.from(set);
  }, [availableProducts]);

  // Category item counts based on available products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: availableProducts.length };
    availableProducts.forEach((p) => {
      if (p.category) {
        const cat = p.category.trim().toUpperCase();
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [availableProducts]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      // Category Filter
      if (selectedCategory !== 'SEMUA') {
        if (p.category.toUpperCase() !== selectedCategory.toUpperCase()) {
          return false;
        }
      }

      // Search Term Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(term);
        const matchesSku = p.sku.toLowerCase().includes(term);
        const matchesCat = p.category.toLowerCase().includes(term);
        const matchesDesc = (p.description || '').toLowerCase().includes(term);
        return matchesName || matchesSku || matchesCat || matchesDesc;
      }

      return true;
    }).sort((a, b) => {
      const priceA = sheetsConfig.useRedPrice ? a.redPrice : a.regularPrice;
      const priceB = sheetsConfig.useRedPrice ? b.redPrice : b.regularPrice;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // Default order
    });
  }, [availableProducts, selectedCategory, searchTerm, sortBy, sheetsConfig.useRedPrice]);

  // Cart aggregates
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, item) => {
    const price = sheetsConfig.useRedPrice ? item.product.redPrice : item.product.regularPrice;
    return acc + (price * item.quantity);
  }, 0);

  const getQuantityInCart = (product: Product) => {
    const found = cartItems.find(
      (item) => item.product.id === product.id || (product.name && item.product.name === product.name)
    );
    return found ? found.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-slate-100 flex flex-col font-sans pb-24 md:pb-12 selection:bg-wine-700 selection:text-white relative overflow-x-hidden">
      {/* 1. Deep Base Background Color */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[var(--bg-base)]" />

      {/* 2. Ambient Color Gradient - Diletakkan di BELAKANG pattern agar nuansa merah tetap meresap tanpa memblokir pola tekstur */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(180deg,var(--bg-gradient-top)_0%,var(--bg-gradient-mid)_35%,var(--bg-gradient-bottom)_100%)] opacity-60" />

      {/* 3. Texture/Pattern Background Image - pakai background-attachment:fixed */}
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-cover bg-center bg-fixed opacity-85"
        style={{ backgroundImage: `url(${bgWebImage})` }}
      />

      {/* 4. Overlay Gradien Merah ke Hitam di Depan Background Image */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(180deg,var(--bg-pattern-red)_0%,var(--bg-pattern-maroon)_30%,var(--bg-gradient-bottom)_70%,#000000_100%)] opacity-40" />

      {/* 5. Soft Header Vignette - biarin fixed, areanya kecil dan gak masalah karena emang gak perlu di-blur oleh card */}
      <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-0 bg-gradient-to-b from-[#130000]/65 from-40% to-transparent" />
      {/* Sticky Header */}
      <Header
        totalCartItems={totalCartItems}
        totalCartPrice={totalCartPrice}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSheetsModal={() => setIsSheetsModalOpen(true)}
        sheetsConfig={sheetsConfig}
        isLoadingLive={isLoadingLive}
        onRefreshProducts={loadProducts}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full flex-1 relative z-10">
        {/* Brand Hero Banner */}
        <HeroSection
          useRedPrice={sheetsConfig.useRedPrice}
          onToggleRedPrice={handleToggleRedPrice}
          totalProductsCount={products.length}
        />

        {/* Search & Sort Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onOpenVerticalMenu={() => {
            setAutoCaptureVertical(true);
            setIsVerticalMenuOpen(true);
          }}
        />

        {/* Category Header Label */}
        {selectedCategory !== 'SEMUA' && (
          <div className="px-4 sm:px-6 mt-4 mb-1">
            <h2 className="font-cinzel font-bold text-lg text-rose-200 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block animate-pulse"></span>
              {selectedCategory}
            </h2>
          </div>
        )}

        {/* Product Cards List */}
        <div className="px-4 sm:px-6 my-4">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-[#19060a] rounded-3xl border border-rose-900/40 space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto opacity-70" />
              <h3 className="font-cinzel font-bold text-lg text-rose-100">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-rose-300/70 max-w-sm mx-auto">
                Tidak ada produk yang cocok dengan pencarian &quot;{searchTerm}&quot;. Coba gunakan kata kunci lain atau ubah kategori.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('SEMUA');
                }}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Reset Filter &amp; Tampilkan Semua
              </button>
            </div>
          ) : (
            <div key={selectedCategory} className="flex flex-col gap-2.5 animate-glass-switch">
              {filteredProducts.map((product, idx) => (
                <MenuItemCard
                  key={product.id}
                  product={product}
                  index={idx}
                  quantityInCart={getQuantityInCart(product)}
                  useRedPrice={sheetsConfig.useRedPrice}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Buttons: Copy to PNG & Checkout (disembunyikan saat checkout/cart/vertical menu/order success dibuka agar tidak menutupi tampilan) */}
      {!isCheckoutOpen && !isCartOpen && !isVerticalMenuOpen && !orderSuccessData && (
        <div className="fixed right-3 sm:right-6 top-3 sm:top-5 z-40 flex items-center gap-2">
          {/* Quick Floating Button: Copy to PNG */}
          <button
            onClick={() => {
              setAutoCaptureVertical(true);
              setIsVerticalMenuOpen(true);
            }}
            type="button"
            aria-label="Copy to PNG"
            title="Tampilkan Menu Vertikal & Copy to PNG"
            className="flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 text-white font-black rounded-full shadow-2xl shadow-rose-950/80 border-2 border-rose-400/80 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Copy to PNG</span>
          </button>

          {/* Dedicated Floating Checkout Button (Always Expanded) */}
          <button
            onClick={() => setIsCartOpen(true)}
            type="button"
            aria-label="Checkout di sini"
            className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 text-white rounded-full shadow-2xl shadow-rose-950/90 border-2 border-amber-400/80 hover:border-amber-300 transition-all duration-300 transform hover:scale-105 active:scale-95 glow-red group backdrop-blur-md cursor-pointer"
          >
            <div className="relative flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-amber-400 text-rose-950 text-[10px] sm:text-xs font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow-lg border border-rose-950 animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-xs sm:text-sm tracking-wide">
                Checkout di sini
              </span>

              {totalCartPrice > 0 && (
                <span className="border-l border-rose-400/40 pl-2 text-amber-200 font-price font-black text-xs sm:text-sm">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalCartPrice)}
                </span>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          useRedPrice={sheetsConfig.useRedPrice}
          onUpdateQuantity={handleUpdateCartQuantity}
          onClearCart={handleClearCart}
          onProceedToCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          useRedPrice={sheetsConfig.useRedPrice}
          onOrderSuccess={(order) => {
            setIsCheckoutOpen(false);
            setOrderSuccessData(order);
          }}
        />
      )}

      {isSheetsModalOpen && (
        <GoogleSheetsModal
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
          config={sheetsConfig}
          onConfigChange={setSheetsConfig}
          onSyncProducts={loadProducts}
        />
      )}

      {orderSuccessData && (
        <OrderSuccessModal
          order={orderSuccessData}
          onClose={() => setOrderSuccessData(null)}
          onResetOrder={() => {
            setCartItems([]);
            setOrderSuccessData(null);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-14 py-10 px-4 border-t-2 border-rose-600/60 bg-gradient-to-b from-[#22040a] via-[#160205] to-[#0d0103] text-center text-xs relative z-10 shadow-2xl">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="font-cinzel font-black text-rose-100 text-base sm:text-lg tracking-wider drop-shadow-md">
            {STORE_INFO.name}
          </div>
          <div className="text-amber-300 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
            {STORE_INFO.subtitle}
          </div>
          <p className="text-slate-200 font-medium text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {STORE_INFO.tagline}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/${STORE_INFO.waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-950 border border-emerald-500/60 text-emerald-300 text-xs font-bold hover:bg-rose-900 hover:text-white transition-all shadow-md"
            >
              <span>CS WhatsApp:</span>
              <span className="font-mono font-extrabold text-white text-sm">{STORE_INFO.phone}</span>
            </a>
            <span className="inline-block px-3 py-1.5 rounded-full bg-rose-900/60 border border-rose-500/40 text-amber-200 font-bold text-xs">
              {STORE_INFO.promoBanner}
            </span>
          </div>

          <p className="text-[11px] text-rose-300 font-mono pt-3 border-t border-rose-900/40">
            Official Kediri Online Delivery &bull; Real-time Direct WhatsApp Order
          </p>
        </div>
      </footer>

      {/* Floating Category Filters - Sembunyikan saat checkout, cart, vertical menu, atau order success popup terbuka */}
      {!isCheckoutOpen && !isCartOpen && !isVerticalMenuOpen && !orderSuccessData && (
        <CategoryFilter
          categories={dynamicCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categoryCounts={categoryCounts}
          hasCartItems={totalCartItems > 0}
        />
      )}

      {/* Mode Menu Vertikal (Otomatis Copy ke PNG) */}
      {isVerticalMenuOpen && (
        <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#0a0103]">
          <VerticalMenuView
            products={products}
            categories={dynamicCategories}
            useRedPrice={sheetsConfig.useRedPrice}
            onClose={() => setIsVerticalMenuOpen(false)}
            autoCapture={autoCaptureVertical}
          />
        </div>
      )}
    </div>
  );
}
