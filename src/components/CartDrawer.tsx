import React from 'react';
import { CartItem, Product } from '../types/menu';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, MapPin, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/initialMenu';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  useRedPrice: boolean;
  onUpdateQuantity: (product: Product, delta: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  useRedPrice,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = useRedPrice ? item.product.redPrice : item.product.regularPrice;
      return acc + (price * item.quantity);
    }, 0);
  };

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = calculateSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in flex justify-end">
      <div className="w-full max-w-md bg-[#140407] border-l border-rose-900/40 h-full flex flex-col justify-between shadow-2xl relative animate-slide-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-900/40 flex items-center justify-between bg-[#19060a]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-900/50 text-rose-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel font-bold text-lg text-white">Keranjang Belanja</h2>
              <p className="text-xs text-rose-300/80 font-medium">{totalItemsCount} item terpilih</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-rose-950/80 border-b border-rose-900/30 px-4 py-2.5 flex items-center gap-2 text-xs text-rose-200">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span><strong>{STORE_INFO.promoBanner}</strong> otomatis diaktifkan!</span>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-900/40 flex items-center justify-center text-rose-400">
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-cinzel font-bold text-base text-rose-200">Keranjang Masih Kosong</h3>
              <p className="text-xs text-rose-300/70 max-w-xs">
                Pilih minuman dari daftar menu dan gunakan tombol <strong>+ / -</strong> untuk menambah pesanan.
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const price = useRedPrice ? item.product.redPrice : item.product.regularPrice;
              const itemTotal = price * item.quantity;

              return (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 flex items-center justify-between gap-3 shadow-md"
                >
                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-900/50 text-rose-300 font-bold">
                        {item.product.category}
                      </span>
                      {item.product.volume && (
                        <span className="text-[10px] text-rose-400 font-medium">
                          {item.product.volume}
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-xs sm:text-sm text-white truncate">
                      {item.product.name}
                    </h4>

                    <div className="text-xs font-mono text-rose-200 font-bold mt-0.5">
                      {formatRupiah(price)} x {item.quantity} = <span className="text-emerald-400">{formatRupiah(itemTotal)}</span>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 p-1 bg-rose-950/80 border border-rose-800/80 rounded-xl shrink-0">
                    <button
                      onClick={() => onUpdateQuantity(item.product, -1)}
                      className="w-7 h-7 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-white flex items-center justify-center text-xs font-bold active:scale-90 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <span className="w-6 text-center font-mono font-bold text-xs text-white">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => onUpdateQuantity(item.product, 1)}
                      className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center text-xs font-bold active:scale-90 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-rose-900/40 bg-[#19060a] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-rose-300">
                <span>Subtotal ({totalItemsCount} item)</span>
                <span className="font-mono font-bold text-white">{formatRupiah(subtotal)}</span>
              </div>

              <div className="flex justify-between text-rose-300">
                <span>Ongkos Kirim (Radius ≤ 10km)</span>
                <span className="font-mono font-bold text-emerald-400">GRATIS</span>
              </div>

              <div className="pt-2 border-t border-rose-900/40 flex justify-between items-baseline text-sm">
                <span className="font-cinzel font-bold text-white">Total Harga</span>
                <span className="font-mono font-black text-lg text-emerald-400">{formatRupiah(subtotal)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClearCart}
                className="p-3 bg-rose-950 hover:bg-rose-900 text-rose-400 rounded-2xl border border-rose-900/60 transition-colors"
                title="Kosongkan Keranjang"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={onProceedToCheckout}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/80 active:scale-95 transition-all glow-green"
              >
                <MapPin className="w-4 h-4" />
                <span>Pilih Lokasi &amp; Checkout WA</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
