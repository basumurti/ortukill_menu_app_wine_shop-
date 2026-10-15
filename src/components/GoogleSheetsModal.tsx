import React, { useState } from 'react';
import { SheetsConfig } from '../types/menu';
import { pingSheets, triggerFillCategoriesInSheets, saveSheetsConfig } from '../services/sheetsService';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, Zap, Tag, ShieldCheck, Link, ExternalLink } from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetsConfig;
  onConfigChange: (newConfig: SheetsConfig) => void;
  onSyncProducts: () => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigChange,
  onSyncProducts
}) => {
  const [urlInput, setUrlInput] = useState(config.webAppUrl || '');
  const [useRedPriceInput, setUseRedPriceInput] = useState(config.useRedPrice);
  const [isTesting, setIsTesting] = useState(false);
  const [isFillingCat, setIsFillingCat] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Silakan masukkan Web App URL Google Apps Script Anda.' });
      return;
    }

    setIsTesting(true);
    setStatusMessage({ type: 'info', text: 'Mencoba menghubungkan ke Google Sheets...' });

    const res = await pingSheets(urlInput.trim());
    setIsTesting(false);

    if (res.success) {
      const updatedConfig: SheetsConfig = {
        ...config,
        webAppUrl: urlInput.trim(),
        isConnected: true,
        useRedPrice: useRedPriceInput,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      saveSheetsConfig(updatedConfig);
      onConfigChange(updatedConfig);
      setStatusMessage({ type: 'success', text: `✅ ${res.message}` });
      onSyncProducts();
    } else {
      setStatusMessage({ type: 'error', text: `❌ ${res.message}` });
    }
  };

  const handleFillCategories = async () => {
    if (!config.webAppUrl) {
      setStatusMessage({ type: 'error', text: 'Koneksikan Google Sheets terlebih dahulu.' });
      return;
    }

    setIsFillingCat(true);
    setStatusMessage({ type: 'info', text: 'Proses update Kategori di Kolom J spreadsheet...' });

    const res = await triggerFillCategoriesInSheets(config.webAppUrl);
    setIsFillingCat(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: `✅ ${res.message}` });
      onSyncProducts();
    } else {
      setStatusMessage({ type: 'error', text: `❌ ${res.message}` });
    }
  };

  const handleSaveSettings = () => {
    const updatedConfig: SheetsConfig = {
      ...config,
      webAppUrl: urlInput.trim(),
      useRedPrice: useRedPriceInput
    };
    saveSheetsConfig(updatedConfig);
    onConfigChange(updatedConfig);
    setStatusMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#140407] border border-rose-900/50 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-900/40 flex items-center justify-between bg-[#19060a]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-900/50 text-rose-300">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg text-white">Integrasi Google Sheets</h2>
              <p className="text-xs text-rose-300/80">Update menu, kategori &amp; simpan penjualan otomatis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/80 border-rose-700 text-rose-200'
                  : 'bg-amber-950/80 border-amber-700 text-amber-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="flex-1 font-medium">{statusMessage.text}</span>
            </div>
          )}

          {/* Web App URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-rose-200 flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5 text-rose-400" /> Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-white placeholder-rose-500/40 font-mono focus:outline-none focus:border-rose-500"
            />
            <p className="text-[11px] text-rose-300/70">
              Masukkan URL Web App dari Apps Script spreadsheet ORTUKILL POS.
            </p>
          </div>

          {/* Price List Display Mode Toggle */}
          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Tampilkan List Harga Merah</span>
                <span className="text-[11px] text-rose-300/70">
                  Menggunakan harga khusus reseller / promo dari Kolom G spreadsheet.
                </span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={useRedPriceInput}
              onChange={(e) => setUseRedPriceInput(e.target.checked)}
              className="w-5 h-5 accent-rose-600 rounded cursor-pointer"
            />
          </div>

          {/* Connected Sheet Layout Information */}
          <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-3.5 space-y-2 text-xs">
            <div className="font-bold text-rose-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Skema Database Google Sheets (ORTUKILL V3.3)
            </div>
            <ul className="space-y-1 text-rose-300/80 font-mono text-[11px] list-disc list-inside">
              <li><strong className="text-white">DASHBOARD_MUTASI_&amp;_PROFIT (B70:J)</strong> &rarr; Master Produk &amp; Harga Merah (Read-only)</li>
              <li><strong className="text-white">LOG_PENJUALAN (B7:M)</strong> &rarr; Target Penulisan Transaksi Kasir</li>
              <li><strong className="text-white">LOG_BARANG_MASUK (B4:H)</strong> &rarr; Riwayat Restock</li>
              <li><strong className="text-white">LAIN-LAIN (A4:F)</strong> &rarr; Pengeluaran Operasional</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="py-3 px-4 bg-rose-900 hover:bg-rose-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Mengecek...' : 'Tes Koneksi & Sync'}</span>
            </button>

            <button
              type="button"
              onClick={handleFillCategories}
              disabled={isFillingCat}
              className="py-3 px-4 bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800/60 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-amber-400 ${isFillingCat ? 'animate-spin' : ''}`} />
              <span>{isFillingCat ? 'Mengisi...' : 'Isi Kategori (Kolom J)'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="w-full py-3 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
