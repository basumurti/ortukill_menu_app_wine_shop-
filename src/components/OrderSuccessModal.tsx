import React, { useState } from 'react';
import { OrderDetails } from '../types/menu';
import { STORE_INFO } from '../data/initialMenu';
import { CheckCircle2, Copy, ExternalLink, MapPin, Phone, RefreshCw, ShoppingBag, X } from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onClose: () => void;
  onResetOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onResetOrder
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  let itemSummary = '';
  order.items.forEach((item, index) => {
    itemSummary += `${index + 1}. ${item.product.name} (${item.quantity}x) = ${formatRupiah((item.product.redPrice || item.product.regularPrice) * item.quantity)}\n`;
  });

  const fullAddressText = order.location.address;

  // Build delivery fee info text
  let ongkirText = 'GRATIS (Radius ≤ 10km)';
  let ruteDetailText = '';
  if (order.shippingFee > 0 && order.durationMinutes) {
    ongkirText = `${formatRupiah(order.shippingFee)} (Jarak ~${order.distanceKm || '-'} km)`;
    ruteDetailText = `\n⏱️ *Estimasi Rute:* ~${order.durationMinutes} menit tempuh dari Base`;
  } else if (order.location?.distanceKm !== undefined) {
    ongkirText = `GRATIS (Radius ~${order.location.distanceKm} km ≤ 10 km dari Base)`;
    if (order.location.durationMinutes) {
      ruteDetailText = `\n⏱️ *Estimasi Tempuh:* ~${order.location.durationMinutes} menit`;
    }
  }

  const waMessage = 
`*PESANAN BARU - ${STORE_INFO.name}*
================================
🆔 *No. Transaksi:* ${order.id}
👤 *Nama Pelanggan:* ${order.customerName}
${order.customerPhone ? `📱 *No. WhatsApp:* ${order.customerPhone}\n` : ''}💳 *Metode Bayar:* ${order.paymentMethod}

*DAFTAR PESANAN:*
${itemSummary}
--------------------------------
💵 *SUBTOTAL HARGA:* ${formatRupiah(order.subtotal)}
🚚 *ONGKIR:* ${ongkirText}${ruteDetailText}
🔥 *TOTAL BAYAR:* *${formatRupiah(order.total)}*

📍 *TITIK MAPS PENGIRIMAN (GOOGLE MAPS):*
${order.location.googleMapsUrl || 'Silahkan kirim lokasi'}

🏠 *Alamat/Patokan:* ${fullAddressText}
📝 *Catatan:* ${order.notes || '-'}

Mohon diproses pesanannya ya kak, terima kasih!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenWA = () => {
    const encoded = encodeURIComponent(waMessage);
    window.open(`https://wa.me/${STORE_INFO.waNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#140407] border border-rose-900/50 rounded-3xl shadow-2xl overflow-hidden relative my-auto">
        {/* Header */}
        <div className="p-5 border-b border-rose-900/40 bg-gradient-to-r from-emerald-950 via-rose-950 to-emerald-950 text-center relative">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h2 className="font-cinzel font-bold text-xl text-white">Pesanan Terkirim!</h2>
          <p className="text-xs text-emerald-200 font-medium">Terima kasih {order.customerName}, pesanan Anda telah diproses.</p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Summary Box */}
          <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex justify-between font-mono text-rose-300">
              <span>No. Transaksi:</span>
              <span className="font-bold text-white">{order.id}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>Metode Pembayaran:</span>
              <span className="font-bold text-white">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>Subtotal Produk:</span>
              <span className="font-mono font-bold text-white">{formatRupiah(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-rose-300">
              <span>Ongkos Kirim:</span>
              <span className="font-mono font-bold text-emerald-400">
                {order.shippingFee > 0 ? formatRupiah(order.shippingFee) : 'GRATIS (Radius ≤ 10km)'}
              </span>
            </div>
            <div className="flex justify-between text-rose-200 font-bold pt-1 border-t border-rose-900/30">
              <span>Total Bayar:</span>
              <span className="font-mono font-black text-emerald-400 text-sm">{formatRupiah(order.total)}</span>
            </div>

            <div className="pt-2 border-t border-rose-900/40 space-y-1">
              <span className="font-bold text-white block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Titik Google Maps:
              </span>
              <a
                href={order.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-300 underline font-mono text-[11px] break-all block hover:text-white"
              >
                {order.location.googleMapsUrl}
              </a>
            </div>
          </div>

          {/* WhatsApp Text Preview Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-rose-200">
              <span>Preview Teks WhatsApp:</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-rose-400 hover:text-rose-200 flex items-center gap-1 text-[11px]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Tercopy!' : 'Copy Teks'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={5}
              value={waMessage}
              className="w-full p-3 bg-rose-950/60 border border-rose-900/60 rounded-xl text-[11px] font-mono text-rose-100 focus:outline-none resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleOpenWA}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all glow-green"
            >
              <ExternalLink className="w-4 h-4" />
              <span>BUKA WHATSAPP CS KEMBALI</span>
            </button>

            <button
              onClick={() => {
                onResetOrder();
                onClose();
              }}
              className="w-full py-3 px-4 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-900/60 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Buat Pesanan Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
