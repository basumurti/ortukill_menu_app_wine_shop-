import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types/menu';
import { STORE_INFO } from '../data/initialMenu';
import logoImg from '../assets/images/Gemini_Generated_Image_28w0jh28w0jh28w0-removebg-preview.png';
import bgWebImage from '../assets/images/ORTUKILL bg web.jpg';
import { toBlob, toPng } from 'html-to-image';
import {
  Copy,
  Download,
  ArrowLeft,
  Check,
  Loader2,
  Filter,
  Smartphone,
  ArrowRight
} from 'lucide-react';

interface VerticalMenuViewProps {
  products: Product[];
  categories: string[];
  useRedPrice: boolean;
  onClose: () => void;
  autoCapture?: boolean;
}

interface PageCategoryBlock {
  category: string;
  products: Product[];
}

interface MenuPageData {
  pageNumber: number;
  totalPages: number;
  categories: PageCategoryBlock[];
  totalItemsOnPage: number;
}

export const VerticalMenuView: React.FC<VerticalMenuViewProps> = ({
  products,
  categories,
  useRedPrice,
  onClose,
  autoCapture = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('SEMUA');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPages, setCopiedPages] = useState<Record<number, boolean>>({});
  const [nextStepPage, setNextStepPage] = useState<number | null>(null);
  const [activePageInView, setActivePageInView] = useState<number>(1);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter categories to display
  const categoriesToDisplay = selectedCategory === 'SEMUA'
    ? categories.filter(c => c !== 'SEMUA')
    : [selectedCategory];

  // Dynamic Pagination that distributes products evenly and fits phone ratio without blank spaces
  const pagesData: MenuPageData[] = useMemo(() => {
    const allCategoryBlocks: PageCategoryBlock[] = [];

    for (const cat of categoriesToDisplay) {
      const catProds = products.filter(p => p.category.toUpperCase() === cat.toUpperCase());
      if (catProds.length > 0) {
        allCategoryBlocks.push({ category: cat, products: catProds });
      }
    }

    const totalProductsCount = allCategoryBlocks.reduce((acc, b) => acc + b.products.length, 0);

    // If total items fits comfortably in 1 page (<= 18 items)
    if (totalProductsCount <= 18) {
      return [{
        pageNumber: 1,
        totalPages: 1,
        categories: allCategoryBlocks,
        totalItemsOnPage: totalProductsCount
      }];
    }

    // Target ~18 items per page so standard 35 items splits cleanly into 2 full pages
    const targetPages = Math.ceil(totalProductsCount / 18);
    const targetPerPage = Math.ceil(totalProductsCount / targetPages);

    const pages: PageCategoryBlock[][] = [];
    let currentPageBlocks: PageCategoryBlock[] = [];
    let currentCount = 0;
    // Page 1 header is slightly taller, so capacity is targetPerPage - 1
    const maxForPage = (pageIdx: number) => (pageIdx === 0 ? Math.max(12, targetPerPage - 1) : targetPerPage + 1);

    for (const block of allCategoryBlocks) {
      let prodsRemaining = [...block.products];

      while (prodsRemaining.length > 0) {
        const pageIdx = pages.length;
        const limit = maxForPage(pageIdx);
        const spaceLeft = limit - currentCount;

        if (spaceLeft <= 0 && currentCount > 0) {
          pages.push(currentPageBlocks);
          currentPageBlocks = [];
          currentCount = 0;
          continue;
        }

        const takeCount = Math.min(Math.max(1, spaceLeft), prodsRemaining.length);
        const chunk = prodsRemaining.slice(0, takeCount);
        prodsRemaining = prodsRemaining.slice(takeCount);

        const isContinuation = chunk.length < block.products.length && prodsRemaining.length < block.products.length;
        currentPageBlocks.push({
          category: isContinuation && currentPageBlocks.length === 0 ? `${block.category} (Lanjutan)` : block.category,
          products: chunk
        });

        currentCount += chunk.length;

        if (currentCount >= limit) {
          pages.push(currentPageBlocks);
          currentPageBlocks = [];
          currentCount = 0;
        }
      }
    }

    if (currentPageBlocks.length > 0) {
      pages.push(currentPageBlocks);
    }

    const totalPages = pages.length;
    return pages.map((catBlocks, idx) => {
      const itemsCount = catBlocks.reduce((sum, b) => sum + b.products.length, 0);
      return {
        pageNumber: idx + 1,
        totalPages,
        categories: catBlocks,
        totalItemsOnPage: itemsCount
      };
    });
  }, [categoriesToDisplay, products]);

  const scrollToPage = (pageNum: number) => {
    setActivePageInView(pageNum);
    const target = pageRefs.current[pageNum];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy page to clipboard
  const handleCopyPage = async (pageNumber: number) => {
    const node = document.getElementById(`vertical-menu-canvas-page-${pageNumber}`);
    if (!node || isCapturing) return;

    setIsCapturing(true);
    setToastMessage(`⏳ Mengonversi Halaman ${pageNumber} ke PNG...`);

    try {
      const blob = await toBlob(node, {
        pixelRatio: 2,
        backgroundColor: '#140206',
        cacheBust: true,
        width: node.offsetWidth,
        height: node.offsetHeight
      });

      if (!blob) throw new Error('Gagal render blob');

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedPages(prev => ({ ...prev, [pageNumber]: true }));

          if (pageNumber < pagesData.length) {
            setNextStepPage(pageNumber + 1);
            setToastMessage(`✅ Hal ${pageNumber} disalin! Paste di WhatsApp, lalu klik Salin Hal ${pageNumber + 1}.`);
          } else {
            setNextStepPage(null);
            setToastMessage(`✅ Hal ${pageNumber} berhasil disalin ke clipboard! Siap di-paste.`);
          }
        } catch (clipErr) {
          downloadBlob(blob, `menu-ortukill-hal-${pageNumber}.png`);
          setToastMessage(`📥 Hal ${pageNumber} diunduh sebagai PNG.`);
        }
      } else {
        downloadBlob(blob, `menu-ortukill-hal-${pageNumber}.png`);
        setToastMessage(`📥 Hal ${pageNumber} berhasil diunduh sebagai PNG!`);
      }
    } catch (err) {
      console.error(`Error copying page ${pageNumber}:`, err);
      try {
        const dataUrl = await toPng(node, {
          pixelRatio: 2,
          backgroundColor: '#140206',
          cacheBust: true,
          width: node.offsetWidth,
          height: node.offsetHeight
        });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `menu-ortukill-hal-${pageNumber}.png`;
        a.click();
        setToastMessage(`📥 Hal ${pageNumber} berhasil diunduh sebagai PNG!`);
      } catch (e) {
        setToastMessage(`❌ Gagal membuat gambar Hal ${pageNumber}.`);
      }
    } finally {
      setIsCapturing(false);
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  };

  // Download a specific page
  const handleDownloadPage = async (pageNumber: number) => {
    const node = document.getElementById(`vertical-menu-canvas-page-${pageNumber}`);
    if (!node || isCapturing) return;

    setIsCapturing(true);
    setToastMessage(`⏳ Menyiapkan download Halaman ${pageNumber}...`);

    try {
      const blob = await toBlob(node, {
        pixelRatio: 2,
        backgroundColor: '#140206',
        cacheBust: true,
        width: node.offsetWidth,
        height: node.offsetHeight
      });

      if (blob) {
        downloadBlob(blob, `menu-ortukill-hal-${pageNumber}.png`);
        setToastMessage(`📥 Halaman ${pageNumber} berhasil diunduh!`);
      }
    } catch (err) {
      setToastMessage(`❌ Gagal unduh halaman ${pageNumber}.`);
    } finally {
      setIsCapturing(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Download all pages sequentially (not zip, 1 by 1)
  const handleDownloadAllSequentially = async () => {
    if (isCapturing) return;
    setIsCapturing(true);

    try {
      for (let i = 0; i < pagesData.length; i++) {
        const pageNum = i + 1;
        const node = document.getElementById(`vertical-menu-canvas-page-${pageNum}`);
        if (node) {
          setToastMessage(`⏳ Mengunduh Halaman ${pageNum} dari ${pagesData.length}...`);
          const blob = await toBlob(node, {
            pixelRatio: 2,
            backgroundColor: '#140206',
            cacheBust: true,
            width: node.offsetWidth,
            height: node.offsetHeight
          });
          if (blob) {
            downloadBlob(blob, `menu-ortukill-hal-${pageNum}.png`);
          }
          await new Promise(res => setTimeout(res, 600));
        }
      }
      setToastMessage(`✅ Semua ${pagesData.length} halaman PNG berhasil diunduh 1 per 1!`);
    } catch (err) {
      setToastMessage('❌ Gagal mengunduh semua halaman.');
    } finally {
      setIsCapturing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  useEffect(() => {
    if (autoCapture) {
      const timer = setTimeout(() => {
        handleCopyPage(1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoCapture]);

  return (
    <div className="min-h-screen bg-[#0a0103] text-white flex flex-col font-sans relative z-50 selection:bg-[#DC0C13] selection:text-white pb-24">
      {/* RESPONSIVE STICKY TOP CONTROL TOOLBAR */}
      <header className="sticky top-0 z-50 bg-[#120205]/95 backdrop-blur-xl border-b border-rose-900/50 px-3 sm:px-6 py-2.5 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Back button */}
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer border border-white/10 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          {/* Center: Page Jump Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {pagesData.map((page) => (
              <button
                key={page.pageNumber}
                onClick={() => scrollToPage(page.pageNumber)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all shrink-0 cursor-pointer border ${
                  activePageInView === page.pageNumber
                    ? 'bg-rose-600 border-rose-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                Hal {page.pageNumber}
              </button>
            ))}
          </div>

          {/* Right: Quick actions */}
          <div className="flex items-center gap-2 shrink-0">
            {pagesData.length > 1 && (
              <button
                onClick={handleDownloadAllSequentially}
                disabled={isCapturing}
                type="button"
                title="Download semua halaman PNG satu per satu"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Unduh Semua ({pagesData.length})</span>
              </button>
            )}

            <button
              onClick={() => handleCopyPage(activePageInView)}
              disabled={isCapturing}
              type="button"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-rose-950/80 active:scale-95 transition-all cursor-pointer border border-rose-400/60"
            >
              {isCapturing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : copiedPages[activePageInView] ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <Copy className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>Copy Hal {activePageInView}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3 h-3" /> Kategori:
          </span>
          <button
            onClick={() => setSelectedCategory('SEMUA')}
            type="button"
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'SEMUA'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950 border border-white/30'
                : 'bg-white/5 text-rose-200/80 hover:bg-white/10'
            }`}
          >
            Semua ({products.length}) &bull; {pagesData.length} Hal
          </button>
          {categories.filter(c => c !== 'SEMUA').map((cat) => {
            const count = products.filter(p => p.category.toUpperCase() === cat.toUpperCase()).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                type="button"
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-950 border border-white/30'
                    : 'bg-white/5 text-rose-200/80 hover:bg-white/10'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </header>

      {/* FLOATING TOAST NOTIFICATION & SEQUENTIAL COPY HELPER */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 sm:px-6 py-3.5 rounded-2xl bg-[#140206]/95 border-2 border-rose-500 text-white text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-center gap-3 animate-bounce max-w-[95vw]">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>{toastMessage}</span>
          </div>

          {nextStepPage && (
            <button
              onClick={() => handleCopyPage(nextStepPage)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-rose-400/60"
            >
              <span>👉 Lanjut Salin Hal {nextStepPage}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* MAIN CONTAINER: VERTICAL PAGES STACK */}
      <main className="flex-1 flex flex-col items-center gap-10 p-3 sm:p-6 overflow-x-hidden">
        {pagesData.map((page) => (
          <div
            key={page.pageNumber}
            ref={(el) => {
              pageRefs.current[page.pageNumber] = el;
            }}
            className="flex flex-col items-center gap-2 w-full max-w-[500px] sm:max-w-[530px]"
          >
            {/* Top Toolbar Header Above Each Card */}
            <div className="w-full flex items-center justify-between px-2 py-1 text-xs">
              <span className="font-bold text-white/90 flex items-center gap-1.5 font-serif">
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>Rasio HP &bull; Halaman {page.pageNumber} dari {page.totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyPage(page.pageNumber)}
                  disabled={isCapturing}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow transition-all cursor-pointer active:scale-95 border border-rose-400/50"
                >
                  <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copy Hal {page.pageNumber}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPage(page.pageNumber)}
                  disabled={isCapturing}
                  title="Unduh halaman ini sebagai PNG"
                  className="p-1 sm:px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer border border-white/10"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* THE PHONE POSTER CANVAS BOARD */}
            {/* Auto height, tight dense line spacing matching the user's reference photo */}
            <div
              id={`vertical-menu-canvas-page-${page.pageNumber}`}
              style={{
                fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
                backgroundColor: '#140206'
              }}
              className="w-full max-w-[500px] sm:max-w-[530px] rounded-3xl border border-rose-500/40 px-3 sm:px-4 py-4 sm:py-5 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white relative overflow-hidden flex flex-col select-none"
            >
              {/* LAYER 1: Deep Base Color */}
              <div className="absolute inset-0 bg-[#140206] z-0 pointer-events-none" />

              {/* LAYER 2: Pattern Texture Background dari ORTUKILL bg web.jpg */}
              <img
                src={bgWebImage}
                alt="Background Pattern"
                className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-100 select-none"
              />

              {/* LAYER 3: Ambient Color Gradient */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(141,2,8,0.20) 0%, rgba(74,6,12,0.18) 30%, rgba(20,2,6,0.35) 70%, rgba(10,1,3,0.50) 100%)'
                }}
              />

              {/* LAYER 4: Soft Vignette Edges */}
              <div className="absolute inset-0 z-0 pointer-events-none shadow-[inset_0_0_60px_rgba(20,2,6,0.65)]" />

              {/* CONTENT CONTAINER */}
              <div className="relative z-10 flex flex-col w-full">
                {/* HEADER: Matching Reference Image with Big Logo + Elegant Cursive "Price List" */}
                {page.pageNumber === 1 ? (
                  <div className="text-center pb-3 mb-3 shrink-0">
                    <div className="flex justify-center mb-1 px-2">
                      <img
                        src={logoImg}
                        alt={STORE_INFO.name}
                        className="h-32 sm:h-36 w-auto max-w-[290px] object-contain drop-shadow-[0_8px_24px_rgba(220,12,19,0.85)] filter brightness-105"
                      />
                    </div>

                    {/* Cursive "Price List" with flanking dashes as seen in reference */}
                    <div className="flex items-center justify-center gap-3">
                      <span className="w-8 h-[1.5px] bg-white/70" />
                      <span
                        className="text-2xl sm:text-3xl text-white font-normal tracking-wide drop-shadow-[0_2px_10px_rgba(220,12,19,0.7)]"
                        style={{ fontFamily: '"Great Vibes", cursive' }}
                      >
                        Price List
                      </span>
                      <span className="w-8 h-[1.5px] bg-white/70" />
                    </div>
                  </div>
                ) : (
                  /* COMPACT HEADER FOR SUBSEQUENT PAGES */
                  <div className="pb-2.5 mb-2.5 border-b border-rose-500/30 flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={logoImg}
                        alt={STORE_INFO.name}
                        className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_4px_14px_rgba(220,12,19,0.7)]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-lg text-white font-normal"
                            style={{ fontFamily: '"Great Vibes", cursive' }}
                          >
                            Price List
                          </span>
                          <span className="text-[10px] text-rose-300 font-mono font-bold">
                            &bull; BAGIAN {page.pageNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-rose-900/90 border border-rose-400/50 text-white text-[9px] font-bold font-mono">
                        HAL {page.pageNumber} / {page.totalPages}
                      </span>
                    </div>
                  </div>
                )}

                {/* VERTICAL MENU CATEGORIES & ITEMS: DENSE, CLEAN, MATCHING REFERENCE */}
                <div className="space-y-3.5">
                  {page.categories.map((catBlock) => (
                    <div key={catBlock.category} className="space-y-1">
                      {/* Category Header: Clean, uppercase, bold white text like in reference */}
                      <div className="pt-0.5 pb-0.5">
                        <h2 className="text-[12px] sm:text-[13px] font-black text-white tracking-[0.15em] uppercase font-mono">
                          {catBlock.category}
                        </h2>
                      </div>

                      {/* Product Rows: Dense Spacing (py-[1.5px]), Sleek Single-Line Columns */}
                      <div className="space-y-[1.5px]">
                        {catBlock.products.map((prod) => {
                          const displayPrice = useRedPrice ? prod.redPrice : prod.regularPrice;

                          // Format abv number (e.g., '19.7' or '4.8')
                          const abvVal = prod.abv
                            ? prod.abv.replace(/[^0-9.]/g, '')
                            : '';

                          // Format full price as 'RP 83.000'
                          const priceFormatted = `RP ${new Intl.NumberFormat('id-ID').format(displayPrice)}`;

                          // Full product name preserved as-is from sheet (including volume suffixes like 620ML, 330ML)
                          const displayName = prod.name.trim();

                          return (
                            <div
                              key={prod.id}
                              className="flex items-baseline justify-between text-[9.5px] sm:text-[10px] leading-snug py-[1.5px] border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.03] transition-colors"
                            >
                              {/* Left: Product Name (maximum width, 1 line sleek uppercase) */}
                              <div className="flex-1 min-w-0 pr-1.5">
                                <span
                                  className="font-semibold text-white/95 uppercase tracking-tight block truncate"
                                  title={displayName}
                                >
                                  {displayName}
                                </span>
                              </div>

                              {/* Center: ABV value (clean plain number like 19.7, 4.8) */}
                              <div className="w-7 sm:w-8 text-right shrink-0 pr-1">
                                {abvVal ? (
                                  <span className="font-mono font-medium text-rose-200/90 tabular-nums text-[9px] sm:text-[9.5px]">
                                    {abvVal}
                                  </span>
                                ) : (
                                  <span className="text-transparent">-</span>
                                )}
                              </div>

                              {/* Right: Price (e.g. RP 83.000) */}
                              <div className="w-[68px] sm:w-[72px] text-right shrink-0">
                                <span className="font-mono font-bold text-white tabular-nums tracking-normal text-[9.5px] sm:text-[10px]">
                                  {priceFormatted}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FOOTER SECTION: CS NUMBER + PROMO PILL BANNER MATCHING USER REFERENCE */}
                <div className="mt-5 pt-2 flex flex-col items-center gap-2 shrink-0">
                  {/* Customer Service info */}
                  <div className="text-center font-mono font-bold text-[10.5px] sm:text-[11px] text-white tracking-widest uppercase">
                    CUSTOMER SERVICE : {STORE_INFO.phone.replace(/(\d{4})(\d{4})(\d+)/, '$1-$2-$3')}
                  </div>

                  {/* Promo Banner Rounded Pill: Light grey/rose pill with dark bold text */}
                  <div className="w-full py-1.5 px-4 rounded-xl bg-[#c5b5ba] text-[#140206] font-mono font-black text-center text-[12px] sm:text-[13px] tracking-wider uppercase shadow-md">
                    *GRATIS ONGKIR AREA KEDIRI
                  </div>

                  {/* Tiny subtle page indicator */}
                  {page.totalPages > 1 && (
                    <div className="text-[9px] text-white/50 font-mono mt-0.5">
                      Halaman {page.pageNumber} dari {page.totalPages}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};
