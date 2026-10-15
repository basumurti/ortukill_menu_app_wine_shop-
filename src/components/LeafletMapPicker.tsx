import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  CheckCircle2, 
  Store, 
  Search, 
  X, 
  Building2, 
  GraduationCap, 
  Hospital, 
  ShoppingBag, 
  Trees, 
  Crosshair,
  Hotel
} from 'lucide-react';
import { STORE_ORIGIN } from '../services/deliveryService';
import { KEDIRI_PLACES, searchKediriPlaces, KediriPlace } from '../data/kediriPlaces';

interface LeafletMapPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationSelect: (lat: number, lng: number, addressSuggestion?: string) => void;
}

// Pusat Kota Kediri
const DEFAULT_KEDIRI = { lat: -7.8234, lng: 112.0123 };

// Filter kategori cepat
const CATEGORY_TABS = [
  'Semua',
  'Hotel',
  'Landmark',
  'Kecamatan',
  'Kampus',
  'Rumah Sakit',
  'Mall & Pasar',
  'Wisata & Taman'
] as const;

export const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({
  initialLat,
  initialLng,
  onLocationSelect
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentLat, setCurrentLat] = useState<number>(initialLat || DEFAULT_KEDIRI.lat);
  const [currentLng, setCurrentLng] = useState<number>(initialLng || DEFAULT_KEDIRI.lng);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Pilih titik kirim di peta Kota & Kab. Kediri');

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('Semua');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim()) {
      return searchKediriPlaces(searchQuery, 12);
    }
    if (selectedCategoryTab !== 'Semua') {
      if (selectedCategoryTab === 'Hotel') {
        return KEDIRI_PLACES.filter((p) => p.category === 'Hotel & Penginapan').slice(0, 15);
      }
      return KEDIRI_PLACES.filter((p) => p.category === selectedCategoryTab).slice(0, 12);
    }
    // Default rekomendasi populer
    return KEDIRI_PLACES.slice(0, 8);
  }, [searchQuery, selectedCategoryTab]);

  // Update position and propagate callback
  const handlePositionChange = (lat: number, lng: number, label?: string) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    const roundedLat = lat.toFixed(6);
    const roundedLng = lng.toFixed(6);
    const addr = label || `Area Kediri (${roundedLat}, ${roundedLng})`;
    setLocationStatus(`📍 Terpilih: ${addr}`);
    onLocationSelect(lat, lng, addr);

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const startLat = initialLat || DEFAULT_KEDIRI.lat;
    const startLng = initialLng || DEFAULT_KEDIRI.lng;

    // Batas area Kota dan Kabupaten Kediri agar fokus dan ringan
    const kediriSouthWest = L.latLng(-8.15, 111.70);
    const kediriNorthEast = L.latLng(-7.55, 112.35);
    const kediriBounds = L.latLngBounds(kediriSouthWest, kediriNorthEast);

    // Inisialisasi peta Leaflet ringan (Pure Raster Tile)
    const map = L.map(mapContainerRef.current, {
      center: [startLat, startLng],
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
      maxBounds: kediriBounds,
      maxBoundsViscosity: 0.8,
      attributionControl: false,
      zoomControl: true
    });

    // Tile layer OpenStreetMap yang sangat cepat dan kompatibel di semua device
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Custom Icon Base Outlet Ortukill Kediri
    const storeIcon = L.divIcon({
      className: 'store-custom-marker',
      html: `
        <div style="transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center;">
          <div style="background: linear-gradient(135deg, #d97706, #b45309); color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); border: 2px solid #ffffff; font-size: 15px;">
            🍷
          </div>
          <div style="background: #1e1b4b; color: #fde68a; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 6px; margin-top: 2px; border: 1px solid #d97706; white-space: nowrap;">
            BASE TOKO
          </div>
        </div>
      `,
      iconSize: [36, 48],
      iconAnchor: [18, 24]
    });

    const storeMarker = L.marker([STORE_ORIGIN.lat, STORE_ORIGIN.lng], {
      icon: storeIcon,
      interactive: true
    }).addTo(map);

    storeMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #0f172a; padding: 2px;">
        <strong style="color: #be123c;">🍷 Ortukill Kediri (Base)</strong><br/>
        <span style="font-size: 11px; color: #64748b;">7°48'33.3"S 112°01'20.0"E</span><br/>
        <span style="font-size: 11px; font-weight: bold; color: #059669;">✨ Radius Gratis: ≤ ${STORE_ORIGIN.freeShippingRadiusKm} km</span>
      </div>
    `);

    // Lingkaran radius gratis ongkir (10 KM) di sekeliling outlet Kediri
    L.circle([STORE_ORIGIN.lat, STORE_ORIGIN.lng], {
      radius: STORE_ORIGIN.freeShippingRadiusKm * 1000,
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.10,
      weight: 1.5,
      dashArray: '5, 5'
    }).addTo(map);

    // Custom Icon Customer Delivery Location (Draggable)
    const customerIcon = L.divIcon({
      className: 'customer-custom-marker',
      html: `
        <div style="transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; cursor: grab;">
          <div style="background: linear-gradient(135deg, #e11d48, #9f1239); color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(225,29,72,0.6); border: 2.5px solid #ffffff; font-size: 18px;">
            📍
          </div>
          <div style="background: #e11d48; color: white; font-size: 9px; font-weight: 800; padding: 1px 6px; border-radius: 6px; margin-top: 2px; border: 1px solid white; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            LOKASI ANDA
          </div>
        </div>
      `,
      iconSize: [40, 52],
      iconAnchor: [20, 26]
    });

    const customerMarker = L.marker([startLat, startLng], {
      icon: customerIcon,
      draggable: true
    }).addTo(map);

    customerMarker.on('dragend', () => {
      const position = customerMarker.getLatLng();
      handlePositionChange(position.lat, position.lng);
    });

    // Ketuk langsung pada peta untuk memindahkan pin pengiriman
    map.on('click', (e: L.LeafletMouseEvent) => {
      customerMarker.setLatLng(e.latlng);
      handlePositionChange(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = customerMarker;

    // Pastikan ukuran peta disesuaikan saat modal tampil
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Quick select place from search results
  const handleSelectPlace = (place: KediriPlace) => {
    const fullLabel = `${place.name}, Kec. ${place.district} (${place.areaType} Kediri)`;
    handlePositionChange(place.lat, place.lng, fullLabel);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([place.lat, place.lng], 15, { animate: true });
    }

    setSearchQuery(place.name);
    setIsSearchFocused(false);
  };

  // Jump to Base Toko Ortukill
  const handleJumpToOutlet = () => {
    handlePositionChange(STORE_ORIGIN.lat, STORE_ORIGIN.lng, 'Outlet Ortukill Kediri (Base Toko)');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([STORE_ORIGIN.lat, STORE_ORIGIN.lng], 15, { animate: true });
    }
    setSearchQuery('Outlet Ortukill Kediri');
    setIsSearchFocused(false);
  };

  // Deteksi GPS HP/Browser
  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      setLocationStatus('⚠️ Browser Anda tidak mendukung GPS.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('🔍 Mengambil titik GPS Anda...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        setLocationStatus(`✅ GPS Akurat (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15, { animate: true });
          markerRef.current.setLatLng([latitude, longitude]);
        }
        handlePositionChange(latitude, longitude, 'Lokasi GPS Akurat Anda');
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Gagal mengambil GPS.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Izin lokasi tidak diberikan. Silakan ketik nama tempat di pencarian atau geser pin di peta.';
        }
        setLocationStatus(`⚠️ ${msg}`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Hotel & Penginapan': return <Hotel className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case 'Kampus': return <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case 'Rumah Sakit': return <Hospital className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'Mall & Pasar': return <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'Wisata & Taman': return <Trees className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
      default: return <Building2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. Quick Search Box Se-Kota & Kabupaten Kediri */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-amber-400/90 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="🔎 Ketik tempat / hotel di Kediri (mis: Grand Surya, Favehotel, SLG, Lotus, Lirboyo)..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#180408] border border-rose-700/70 focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white placeholder-rose-400/50 shadow-inner focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchFocused(false);
              }}
              className="absolute right-3 p-1 rounded-full text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Hasil Pencarian Cepat */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#160307] border-2 border-rose-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-rose-950/60 backdrop-blur-xl">
            <div className="p-2 bg-rose-950/80 text-[10.5px] font-bold text-amber-300 flex items-center justify-between border-b border-rose-900/40">
              <span>{searchQuery ? `Hasil Pencarian (${searchResults.length} Lokasi)` : 'Rekomendasi Tempat Se-Kediri:'}</span>
              <button
                type="button"
                onClick={() => setIsSearchFocused(false)}
                className="text-rose-300 hover:text-white cursor-pointer"
              >
                Tutup ✕
              </button>
            </div>

            {searchResults.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => handleSelectPlace(place)}
                className="w-full p-2.5 px-3 text-left hover:bg-rose-900/50 transition-colors flex items-center justify-between gap-2 text-xs group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/60 group-hover:border-amber-400/60 transition-colors">
                    {getCategoryIcon(place.category)}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-white block truncate group-hover:text-amber-200">
                      {place.name}
                    </span>
                    <span className="text-[10px] text-slate-300 block truncate">
                      Kec. {place.district} &bull; {place.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    place.areaType === 'Kota'
                      ? 'bg-rose-950/90 text-rose-300 border-rose-800'
                      : 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                  }`}>
                    {place.areaType}
                  </span>
                  <Crosshair className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setSelectedCategoryTab(cat);
              setSearchQuery('');
              setIsSearchFocused(true);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryTab === cat && !searchQuery
                ? 'bg-rose-600 text-white font-bold shadow-md glow-red'
                : 'bg-black/40 text-slate-300 hover:text-white border border-rose-900/50 hover:bg-rose-950/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Action Bar: GPS + Base Toko */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGPSDetect}
            disabled={isLocating}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-950/90 hover:bg-rose-900 border border-rose-700/60 text-rose-200 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 text-rose-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Mencari GPS...' : '📍 Gunakan GPS Saya'}</span>
          </button>

          <button
            type="button"
            onClick={handleJumpToOutlet}
            className="flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/50 text-amber-200 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Outlet Kediri</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-300 bg-black/60 px-2.5 py-1.5 rounded-xl border border-emerald-900/60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span>Radius ≤ 10 km Bebas Ongkir (Lingkaran Hijau)</span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-rose-800/60 shadow-lg group">
        <div ref={mapContainerRef} className="w-full h-64 sm:h-72 z-10" />

        {/* Legend Overlay */}
        <div className="absolute top-2 right-2 z-20 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-center gap-2 shadow">
          <span className="flex items-center gap-1"><span className="text-xs">🍷</span> Outlet Base</span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1"><span className="text-xs">📍</span> Lokasi Kirim</span>
        </div>

        {/* Status Bar */}
        <div className="absolute bottom-2 left-2 right-2 z-20 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-rose-900/60 text-[11px] text-rose-200 flex items-center justify-between shadow-md">
          <span className="truncate">{locationStatus}</span>
          <span className="font-mono text-emerald-400 shrink-0 flex items-center gap-1 font-semibold ml-2 text-[10.5px]">
            <CheckCircle2 className="w-3.5 h-3.5" /> Titik Aktif
          </span>
        </div>
      </div>

      {/* Coordinate & Instruction Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-rose-950/30 border border-rose-900/30 rounded-xl p-2.5">
        <div className="flex items-start gap-2 text-xs text-slate-300">
          <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block text-[11px]">Koordinat Pengiriman untuk Kurir:</span>
            <a
              href={`https://www.google.com/maps?q=${currentLat},${currentLng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 underline font-mono text-[10.5px] break-all hover:text-rose-300"
            >
              https://www.google.com/maps?q={currentLat.toFixed(6)},{currentLng.toFixed(6)}
            </a>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1 self-end sm:self-auto">
          <Compass className="w-3.5 h-3.5 text-rose-400" />
          <span>Geser pin 📍 atau ketuk peta</span>
        </div>
      </div>
    </div>
  );
};
