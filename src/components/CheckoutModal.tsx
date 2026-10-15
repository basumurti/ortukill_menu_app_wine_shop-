import React, { useState, useEffect } from 'react';
import { CartItem, LocationData, OrderDetails } from '../types/menu';
import { STORE_INFO } from '../data/initialMenu';
import { 
  X, 
  Send, 
  MapPin, 
  MapPinOff, 
  User, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  RotateCw, 
  ExternalLink, 
  Loader2, 
  Clock, 
  Truck, 
  AlertCircle,
  Compass
} from 'lucide-react';
import { saveTransactionToSheets } from '../services/sheetsService';
import { getDeliveryEstimate, DeliveryEstimate, STORE_ORIGIN } from '../services/deliveryService';
import { LeafletMapPicker } from './LeafletMapPicker';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  useRedPrice: boolean;
  onOrderSuccess: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  useRedPrice,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'TRANSFER' | 'QRIS' | 'GOPAY'>('CASH');
  const [addressDetails, setAddressDetails] = useState('');
  const [notes, setNotes] = useState('');

  // Location State & Geolocation Auto-Pull
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'granted' | 'denied'>('detecting');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [location, setLocation] = useState<LocationData>({
    lat: null,
    lng: null,
    address: 'Silahkan kirim lokasi',
    googleMapsUrl: ''
  });

  // Delivery & route fee calculations
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryEstimate | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate route and shipping fee for given coordinates
  const calculateRouteForLocation = async (lat: number, lng: number, customAddress?: string) => {
    const mapsUrl = `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
    setLocationStatus('granted');
    setLocation({
      lat,
      lng,
      address: customAddress || `Titik GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
      googleMapsUrl: mapsUrl
    });

    setIsCalculatingRoute(true);
    try {
      const estimate = await getDeliveryEstimate(lat, lng);
      setDeliveryInfo(estimate);
    } catch (err) {
      console.warn('Error estimating delivery:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Automatically request geolocation when modal opens
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocation({
        lat: null,
        lng: null,
        address: 'Silahkan kirim lokasi',
        googleMapsUrl: ''
      });
      setDeliveryInfo(null);
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        await calculateRouteForLocation(lat, lng);
      },
      (error) => {
        console.warn('Geolocation denied or error:', error);
        setLocationStatus('denied');
        setLocation({
          lat: null,
          lng: null,
          address: 'Silahkan kirim lokasi',
          googleMapsUrl: ''
        });
        setDeliveryInfo(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    if (isOpen) {
      requestGeolocation();
    }
  }, [isOpen]);

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

  const subtotal = calculateSubtotal();
  const shippingFee = deliveryInfo ? deliveryInfo.shippingFee : 0;
  const grandTotal = subtotal + shippingFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Silakan isi Nama Pemesan.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `TRX-${Date.now().toString().slice(-6)}`;
    
    const locationWithDelivery: LocationData = {
      ...location,
      distanceKm: deliveryInfo?.distanceKm,
      durationMinutes: deliveryInfo?.durationMinutes,
      isFreeShipping: deliveryInfo?.isFreeShipping ?? (locationStatus === 'denied' ? true : false)
    };

    const newOrder: OrderDetails = {
      id: orderId,
      customerName: customerName.trim(),
      customerPhone: '',
      paymentMethod,
      items: cartItems,
      subtotal,
      discount: 0,
      shippingFee,
      total: grandTotal,
      location: locationWithDelivery,
      durationMinutes: deliveryInfo?.durationMinutes,
      distanceKm: deliveryInfo?.distanceKm,
      notes: notes.trim(),
      createdAt: new Date().toISOString()
    };

    // 1. Format clean text message for WhatsApp
    let itemSummary = '';
    cartItems.forEach((item, index) => {
      const price = useRedPrice ? item.product.redPrice : item.product.regularPrice;
      const totalItem = price * item.quantity;
      itemSummary += `${index + 1}. *${item.product.name}* (${item.quantity}x) = ${formatRupiah(totalItem)}\n`;
    });

    const mapsLine = locationStatus === 'granted' && location.googleMapsUrl
      ? location.googleMapsUrl
      : 'Silahkan kirim lokasi';

    const fullAddressText = addressDetails.trim()
      ? addressDetails.trim()
      : (locationStatus === 'granted' ? location.address : 'Silahkan kirim lokasi');

    // Build delivery fee info text for WhatsApp
    let ongkirText = 'GRATIS (Radius ≤ 10km)';
    let ruteDetailText = '';
    if (locationStatus === 'granted' && deliveryInfo) {
      if (deliveryInfo.isFreeShipping) {
        ongkirText = `*GRATIS (Radius ${deliveryInfo.distanceKm} km ≤ 10 km dari Base)*`;
        ruteDetailText = `\n⏱️ *Estimasi Tempuh:* ~${deliveryInfo.durationMinutes} menit (Radius aman dalam 10 km)`;
      } else {
        ongkirText = `*${formatRupiah(deliveryInfo.shippingFee)}* (Jarak ~${deliveryInfo.distanceKm} km)`;
        ruteDetailText = `\n⏱️ *Estimasi Waktu Tempuh:* ~${deliveryInfo.durationMinutes} menit\n`;
      }
    } else if (locationStatus === 'denied') {
      ongkirText = 'Akan dihitung otomatis setelah share live location di chat (Gratis s/d 10km)';
    }

    const waMessage = 
`*PESANAN BARU - ${STORE_INFO.name}*
================================
🆔 *No. Transaksi:* ${orderId}
👤 *Nama Pemesan:* ${customerName.trim()}
💳 *Metode Bayar:* ${paymentMethod}

*DAFTAR PESANAN:*
${itemSummary}
--------------------------------
💵 *SUBTOTAL HARGA:* ${formatRupiah(subtotal)}
🚚 *ONGKIR:* ${ongkirText}${ruteDetailText}
🔥 *TOTAL BAYAR:* *${formatRupiah(grandTotal)}*

📍 *TITIK MAPS PENGIRIMAN:*
${mapsLine}

🏠 *Alamat / Patokan:* ${fullAddressText}
📝 *Catatan:* ${notes.trim() || '-'}

Mohon diproses pesanannya ya kak, terima kasih!`;

    // 2. Try saving to Google Sheets in background if configured
    try {
      await saveTransactionToSheets(newOrder);
    } catch (e) {
      console.warn('Sheets sync optional error:', e);
    }

    setIsSubmitting(false);

    // 3. Open WhatsApp link
    const encodedText = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${STORE_INFO.waNumber}?text=${encodedText}`;

    // Callback to parent to trigger success modal
    onOrderSuccess(newOrder);

    // Redirect to WhatsApp
    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl bg-[#140407] border border-rose-900/50 rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-900/40 flex items-center justify-between bg-[#19060a] shrink-0">
          <div>
            <h2 className="font-cinzel font-bold text-lg sm:text-xl text-rose-100 flex items-center gap-2">
              <span>Checkout Pesanan WhatsApp</span>
            </h2>
            <p className="text-xs text-rose-300/80">Lengkapi nama dan alamat untuk langsung terhubung dengan admin.</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleCheckout} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Customer Personal Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> 1. Data Pemesan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-1">
                Nama Pemesan *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400/80" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Mas Budi Kediri"
                  className="w-full pl-9 pr-3 py-2.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs sm:text-sm text-white placeholder-rose-500/40 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Location Pin & Map Section */}
          <div className="space-y-3 pt-2 border-t border-rose-900/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-400" /> 2. Titik Lokasi Pengiriman
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMapPicker(!showMapPicker)}
                  className="text-[11px] font-semibold text-rose-300 hover:text-white flex items-center gap-1 hover:underline transition-colors cursor-pointer"
                >
                  <Compass className="w-3 h-3 text-amber-400" /> {showMapPicker ? 'Tutup Peta' : '🗺️ Peta Area Kediri'}
                </button>
                {locationStatus !== 'detecting' && (
                  <button
                    type="button"
                    onClick={requestGeolocation}
                    className="text-[11px] font-semibold text-rose-300 hover:text-white flex items-center gap-1 hover:underline transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3" /> Cek Ulang GPS
                  </button>
                )}
              </div>
            </div>

            {/* Interactive OpenFreeMap Picker */}
            {showMapPicker && (
              <div className="p-3 bg-black/60 border border-rose-800/60 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-rose-200">
                  <span className="font-semibold flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-rose-400" /> Geser pin merah untuk ubah titik kirim
                  </span>
                  <span className="text-[10.5px] text-amber-300 font-mono font-bold">Radius Gratis: ≤ 10 km</span>
                </div>
                <LeafletMapPicker
                  initialLat={location.lat || STORE_ORIGIN.lat}
                  initialLng={location.lng || STORE_ORIGIN.lng}
                  onLocationSelect={(lat, lng, addr) => {
                    calculateRouteForLocation(lat, lng, addr);
                  }}
                />
              </div>
            )}

            {/* Status Card: Detecting */}
            {locationStatus === 'detecting' && (
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-800/40 flex items-center gap-3 animate-pulse">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-amber-200">Mendeteksi titik lokasi GPS Anda...</p>
                  <p className="text-rose-300/70 text-[11px]">Silakan klik "Izinkan" / "Allow" jika browser menampilkan permintaan izin lokasi.</p>
                </div>
              </div>
            )}

            {/* Status Card: Granted */}
            {locationStatus === 'granted' && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-emerald-200">Titik Lokasi Berhasil Ditarik</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">GPS Aktif</span>
                    </div>
                    <p className="text-[11px] text-emerald-300/80 font-mono mt-0.5">
                      {location.lat?.toFixed(5)}, {location.lng?.toFixed(5)}
                    </p>
                  </div>
                </div>

                {location.googleMapsUrl && (
                  <a
                    href={location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-xs font-semibold transition-all self-start sm:self-auto"
                  >
                    <span>Buka di Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}

            {/* Status Card: Denied / Unavailable */}
            {locationStatus === 'denied' && (
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-600/40 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPinOff className="w-4 h-4 text-rose-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-rose-200">Silahkan kirim lokasi</span>
                    <button
                      type="button"
                      onClick={requestGeolocation}
                      className="px-2.5 py-1 rounded-lg bg-rose-700/50 hover:bg-rose-600 border border-rose-500/50 text-[11px] font-bold text-white transition-all cursor-pointer"
                    >
                      Izinkan Lokasi
                    </button>
                  </div>
                  <p className="text-[11px] text-rose-300/80 mt-1 leading-relaxed">
                    Izin lokasi tidak diberikan. Titik maps akan otomatis ditulis "Silahkan kirim lokasi" di WhatsApp sehingga Anda dapat melakukan *Share Live Location* langsung di chat WhatsApp.
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-rose-200 mb-1">
                Alamat / Patokan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="Contoh: Depan Indomaret Katang, pagar hitam, rumah no. 12"
                className="w-full p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs sm:text-sm text-white placeholder-rose-500/40 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3 pt-2 border-t border-rose-900/30">
            <h3 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 3. Metode Pembayaran
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'CASH', label: '💵 Cash On Delivery' },
                { id: 'TRANSFER', label: '🏦 Transfer Bank' },
                { id: 'QRIS', label: '📱 QRIS All Payment' },
                { id: 'GOPAY', label: '💙 GoPay / E-Wallet' }
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    paymentMethod === pm.id
                      ? 'bg-rose-600 border-rose-400 text-white shadow-md glow-red'
                      : 'bg-rose-950/40 border-rose-900/50 text-rose-300 hover:bg-rose-900/40'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan Khusus */}
          <div>
            <label className="block text-xs font-semibold text-rose-200 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-rose-400" /> Catatan Khusus Pesanan
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Misal: Tolong kirim yang dingin ya kak, terima kasih"
              className="w-full px-3 py-2 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs text-white placeholder-rose-500/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Order Summary & Submit Button */}
          <div className="bg-rose-950/70 border border-rose-900/60 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-xs text-rose-300">
              <span>Total Pesanan ({cartItems.reduce((a, b) => a + b.quantity, 0)} item)</span>
              <span className="font-mono font-bold text-white">{formatRupiah(subtotal)}</span>
            </div>

            {/* Ongkir Section with Real Delivery Calculation */}
            <div className="p-3 rounded-xl bg-black/40 border border-rose-900/50 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-rose-200 font-semibold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ongkos Kirim:</span>
                </span>
                
                {isCalculatingRoute ? (
                  <span className="text-[11px] text-amber-300 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Menghitung rute...
                  </span>
                ) : deliveryInfo ? (
                  deliveryInfo.isFreeShipping ? (
                    <span className="font-mono font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-xs">
                      GRATIS (Radius ≤ 10km)
                    </span>
                  ) : (
                    <span className="font-mono font-black text-amber-300 text-xs">
                      {formatRupiah(deliveryInfo.shippingFee)}
                    </span>
                  )
                ) : (
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    GRATIS (Radius ≤ 10km)
                  </span>
                )}
              </div>

              {/* Delivery distance and travel duration details */}
              {deliveryInfo && (
                <div className="pt-2 border-t border-rose-900/40 text-[11px] text-rose-200/90 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Compass className="w-3 h-3 text-rose-400" /> Jarak dari Base Toko:
                    </span>
                    <span className="font-mono font-bold text-white">
                      ~{deliveryInfo.distanceKm} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-amber-400" /> Estimasi Waktu Tempuh Riil:
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      ~{deliveryInfo.durationMinutes} Menit
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-rose-900/40 flex justify-between items-baseline">
              <span className="font-cinzel font-bold text-white text-sm">TOTAL BAYAR</span>
              <span className="font-mono font-black text-xl text-emerald-400">{formatRupiah(grandTotal)}</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/90 active:scale-98 transition-all glow-green disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Mempersiapkan WA...' : '📱 KIRIM PESANAN KE WHATSAPP'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
